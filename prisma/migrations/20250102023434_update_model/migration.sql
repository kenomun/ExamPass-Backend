/*
  Warnings:

  - You are about to drop the column `contentScores` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Professor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contentScore` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examScore` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_professorId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "contentScores",
DROP COLUMN "createdAt",
DROP COLUMN "studentId",
DROP COLUMN "totalScore",
DROP COLUMN "updatedAt",
ADD COLUMN     "contentScore" INTEGER NOT NULL,
ADD COLUMN     "examScore" INTEGER NOT NULL,
ADD COLUMN     "profileId" INTEGER NOT NULL,
ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Professor";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subjects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profileSubject" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "isDone" BOOLEAN NOT NULL,

    CONSTRAINT "profileSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_email_key" ON "Profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Students_profileId_key" ON "Students"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "profileSubject_profileId_subjectId_key" ON "profileSubject"("profileId", "subjectId");

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profileSubject" ADD CONSTRAINT "profileSubject_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profileSubject" ADD CONSTRAINT "profileSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
