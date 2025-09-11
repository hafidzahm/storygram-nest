/*
  Warnings:

  - You are about to drop the `_PostsToTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_PostsToTags" DROP CONSTRAINT "_PostsToTags_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PostsToTags" DROP CONSTRAINT "_PostsToTags_B_fkey";

-- DropTable
DROP TABLE "public"."_PostsToTags";

-- CreateTable
CREATE TABLE "public"."PostTags" (
    "postsId" INTEGER NOT NULL,
    "tagsId" INTEGER NOT NULL,

    CONSTRAINT "PostTags_pkey" PRIMARY KEY ("postsId","tagsId")
);

-- AddForeignKey
ALTER TABLE "public"."PostTags" ADD CONSTRAINT "PostTags_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "public"."Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostTags" ADD CONSTRAINT "PostTags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "public"."Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
