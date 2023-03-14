/*
  Warnings:

  - You are about to drop the column `is_filter` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `question_text_short` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `response_id` on the `Question` table. All the data in the column will be lost.
  - Made the column `is_active` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_superuser` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_verified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "blocked" TEXT,
ADD COLUMN     "muted" TEXT[];

-- AlterTable
ALTER TABLE "Listings" ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "distanceToUcf" INTEGER,
ADD COLUMN     "rooms" INTEGER,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "zipcode" TEXT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "is_filter",
DROP COLUMN "question_text_short",
DROP COLUMN "response_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "push_token" TEXT,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT false,
ALTER COLUMN "is_superuser" SET NOT NULL,
ALTER COLUMN "is_superuser" SET DEFAULT false,
ALTER COLUMN "is_verified" SET NOT NULL,
ALTER COLUMN "is_verified" SET DEFAULT false,
ALTER COLUMN "birthday" SET DATA TYPE TEXT,
ALTER COLUMN "phone_number" SET DATA TYPE TEXT,
ALTER COLUMN "zip_code" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matches" (
    "userOneId" TEXT NOT NULL,
    "userTwoId" TEXT NOT NULL,
    "matchPercentage" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ListingsFavorited" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_tag_user_id_key" ON "tags"("tag", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Matches_userOneId_userTwoId_key" ON "Matches"("userOneId", "userTwoId");

-- CreateIndex
CREATE INDEX "Notification_userId_chatId_idx" ON "Notification"("userId", "chatId");

-- CreateIndex
CREATE UNIQUE INDEX "_ListingsFavorited_AB_unique" ON "_ListingsFavorited"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingsFavorited_B_index" ON "_ListingsFavorited"("B");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingsFavorited" ADD CONSTRAINT "_ListingsFavorited_A_fkey" FOREIGN KEY ("A") REFERENCES "Listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingsFavorited" ADD CONSTRAINT "_ListingsFavorited_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
