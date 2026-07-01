ALTER TABLE "intro_course_user" ADD COLUMN "github_username" text;

UPDATE "intro_course_user"
SET "github_username" = "name";

ALTER TABLE "intro_course_user" ALTER COLUMN "github_username" SET NOT NULL;
