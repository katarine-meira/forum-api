-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LEADER', 'MEMBER', 'STUDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';
