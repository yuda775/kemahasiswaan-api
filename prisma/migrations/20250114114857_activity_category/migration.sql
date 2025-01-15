-- DropIndex
DROP INDEX `AcademicYear_year_key` ON `AcademicYear`;

-- AlterTable
ALTER TABLE `ActivityCategory` ADD COLUMN `deletedAt` DATETIME(3) NULL;
