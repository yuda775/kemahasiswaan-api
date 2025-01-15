/*
  Warnings:

  - Added the required column `code` to the `ProgramStudy` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ProgramStudy_name_key` ON `ProgramStudy`;

-- AlterTable
ALTER TABLE `ProgramStudy` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    MODIFY `degree` ENUM('D3', 'S1', 'S2', 'S3') NOT NULL DEFAULT 'S1';
