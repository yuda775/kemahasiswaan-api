/*
  Warnings:

  - You are about to drop the column `commenterId` on the `ProposalComment` table. All the data in the column will be lost.
  - You are about to drop the column `activityCategoryId` on the `StudentActivity` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `StudentAffairs` table. All the data in the column will be lost.
  - Added the required column `activityCategory` to the `StudentActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activityName` to the `StudentActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `StudentActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `StudentActivity` DROP FOREIGN KEY `StudentActivity_activityCategoryId_fkey`;

-- DropIndex
DROP INDEX `StudentActivity_activityCategoryId_fkey` ON `StudentActivity`;

-- DropIndex
DROP INDEX `StudentAffairs_phoneNumber_key` ON `StudentAffairs`;

-- AlterTable
ALTER TABLE `ActivityComment` MODIFY `commenterType` ENUM('STUDENT', 'ADVISOR', 'STUDENTAFFAIRS', 'ADMIN', 'UKMHEAD') NOT NULL;

-- AlterTable
ALTER TABLE `ProposalComment` DROP COLUMN `commenterId`,
    MODIFY `commenterType` ENUM('STUDENT', 'ADVISOR', 'STUDENTAFFAIRS', 'ADMIN', 'UKMHEAD') NOT NULL;

-- AlterTable
ALTER TABLE `StudentActivity` DROP COLUMN `activityCategoryId`,
    ADD COLUMN `activityCategory` VARCHAR(191) NOT NULL,
    ADD COLUMN `activityName` VARCHAR(191) NOT NULL,
    ADD COLUMN `filePath` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `StudentAffairs` DROP COLUMN `phoneNumber`;
