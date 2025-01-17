/*
  Warnings:

  - You are about to drop the column `commenterId` on the `ActivityComment` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `ProposalFile` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `ProposalFile` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `ProposalFile` table. All the data in the column will be lost.
  - Added the required column `name` to the `ProposalFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `ProposalFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ActivityComment` DROP COLUMN `commenterId`;

-- AlterTable
ALTER TABLE `ProposalFile` DROP COLUMN `fileName`,
    DROP COLUMN `filePath`,
    DROP COLUMN `fileType`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL;
