/*
  Warnings:

  - You are about to drop the `user_members` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[question_id,user_id]` on the table `user_profile_question_anwsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('business_owner', 'employee', 'admin');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- DropForeignKey
ALTER TABLE "public"."user_members" DROP CONSTRAINT "user_members_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."question_options" ADD COLUMN     "order_number" INTEGER;

-- AlterTable
ALTER TABLE "public"."user_profile_questions" ADD COLUMN     "order_number" INTEGER;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "role" "public"."Roles" NOT NULL DEFAULT 'employee',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "username" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."user_members";

-- CreateTable
CREATE TABLE "public"."member_invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by_user_id" TEXT NOT NULL,
    "invitation_token" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),

    CONSTRAINT "member_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_question_anwsers_question_id_user_id_key" ON "public"."user_profile_question_anwsers"("question_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."member_invitations" ADD CONSTRAINT "member_invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_profile_question_anwsers" ADD CONSTRAINT "user_profile_question_anwsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
