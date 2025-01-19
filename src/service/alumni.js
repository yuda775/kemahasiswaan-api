const prisma = require("../config/database");

const fs = require("fs");
const path = require("path");

module.exports = {
  getQuestionnaireSubmissions: async (req, res) => {
    try {
      const submissions = await prisma.questionnaireSubmission.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          answers: {
            select: {
              student: {
                select: {
                  name: true,
                  npm: true,
                },
              },
              filePath: true,
            },
          },
        },
      });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getQuestionnaireSubmissionsByAlumni: async (req, res) => {
    try {
      const student = await prisma.student.findUnique({
        where: {
          id: parseInt(req.params.studentId),
        },
        select: {
          graduationYear: true,
        },
      });
      const submission = await prisma.questionnaireSubmission.findMany({
        where: {
          graduationYears: {
            contains: student.graduationYear.toString(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          submissionLink: true,
          answers: {
            select: {
              id: true,
              filePath: true,
            },
          },
        },
      });
      const answers = await prisma.questionnaireAnswer.findMany({
        where: {
          studentId: parseInt(req.params.studentId),
        },
      });
      res.json({ submission, answers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createQuestionnaireSubmission: async (req, res) => {
    try {
      const { title, description, graduationYears, submissionLink } = req.body;
      const submission = await prisma.questionnaireSubmission.create({
        data: {
          title,
          description,
          submissionLink,
          graduationYears,
        },
      });
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateQuestionnaireSubmission: async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await prisma.questionnaireSubmission.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.json(submission);
    } catch (error) {
      console.error("Error in updateQuestionnaireSubmission:", error);
      res.status(500).json({ error: error.message });
    }
  },

  answerQuestionnaire: async (req, res) => {
    try {
      const { studentId, questionnaireSubmissionId } = req.body;
      const files = req.files ? req.files.filePath : null;

      if (files) {
        const existingAnswer = await prisma.questionnaireAnswer.findFirst({
          where: {
            studentId: parseInt(studentId),
            questionnaireSubmissionId: parseInt(questionnaireSubmissionId),
          },
        });

        if (existingAnswer) {
          // Hapus file lama
          const filePath = path.join(
            __dirname,
            "../../public/questionnaire/",
            existingAnswer.filePath
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          // Update answer
          const updatedAnswer = await prisma.questionnaireAnswer.update({
            where: {
              id: existingAnswer.id,
            },
            data: {
              filePath: `${Date.now()}-${files.name}`,
            },
          });

          // Copy file baru
          const newFilePath = path.join(
            __dirname,
            "../../public/questionnaire/",
            updatedAnswer.filePath
          );
          await files.mv(newFilePath);

          return res.json(updatedAnswer);
        } else {
          const uploadDir = path.join(__dirname, "../../public/questionnaire/");

          // Create directory if it doesn't exist
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const newFileName = `${Date.now()}-${files.name}`; // Use the original file name
          const filePathFull = path.join(uploadDir, newFileName);

          // Use the mv method to move the file
          await files.mv(filePathFull);

          const createdAnswer = await prisma.questionnaireAnswer.create({
            data: {
              studentId: parseInt(studentId),
              questionnaireSubmissionId: parseInt(questionnaireSubmissionId),
              filePath: newFileName,
            },
          });

          return res.json(createdAnswer);
        }
      } else {
        return res.status(400).json({ error: "No files provided" });
      }
    } catch (error) {
      console.error("Error in answerQuestionnaire:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  cancleAnswerQuestionnaire: async (req, res) => {
    try {
      const { questionnaireSubmissionId, studentId } = req.params;

      const submission = await prisma.questionnaireSubmission.findUnique({
        where: {
          id: parseInt(questionnaireSubmissionId),
        },
        select: {
          id: true,
          answers: {
            select: {
              id: true,
              filePath: true,
              studentId: true,
            },
          },
        },
      });

      const answerId = submission.answers.find(
        (answer) => answer.studentId === parseInt(studentId)
      );
      if (!answerId) {
        return res.status(404).json({ error: "Answer not found" });
      }

      const answer = await prisma.questionnaireAnswer.delete({
        where: {
          id: answerId.id,
        },
      });

      if (answer?.filePath) {
        const filePathFull = path.resolve(
          __dirname,
          "../../public/questionnaire/",
          answer.filePath
        );
        if (fs.existsSync(filePathFull)) {
          fs.unlinkSync(filePathFull);
        }
      }

      res.json(answer);
    } catch (error) {
      console.error("Error in deleteAnswer:", error);
      res.status(500).json({ error: error.message });
    }
  },
};
