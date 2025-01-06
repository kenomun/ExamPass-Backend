/*
  Warnings:

  - You are about to drop the column `contentScore` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `examScore` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Result` table. All the data in the column will be lost.
  - Added the required column `answers` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_profileId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "contentScore",
DROP COLUMN "examScore",
DROP COLUMN "subjectId",
ADD COLUMN     "answers" JSONB NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
