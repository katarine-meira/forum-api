-- DropForeignKey
ALTER TABLE "public"."Answers" DROP CONSTRAINT "Answers_questionId_fkey";

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
