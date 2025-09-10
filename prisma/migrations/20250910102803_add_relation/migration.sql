-- CreateTable
CREATE TABLE "public"."_PostsToTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PostsToTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostsToTags_B_index" ON "public"."_PostsToTags"("B");

-- AddForeignKey
ALTER TABLE "public"."Profiles" ADD CONSTRAINT "Profiles_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Posts" ADD CONSTRAINT "Posts_ProfileId_fkey" FOREIGN KEY ("ProfileId") REFERENCES "public"."Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PostsToTags" ADD CONSTRAINT "_PostsToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PostsToTags" ADD CONSTRAINT "_PostsToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
