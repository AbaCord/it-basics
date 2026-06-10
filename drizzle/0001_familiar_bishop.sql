CREATE TABLE "intro_course_completion" (
	"user_id" text NOT NULL,
	"challenge_id" text NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "intro_course_completion_user_id_challenge_id_pk" PRIMARY KEY("user_id","challenge_id")
);
--> statement-breakpoint
ALTER TABLE "intro_course_completion" ADD CONSTRAINT "intro_course_completion_user_id_intro_course_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."intro_course_user"("id") ON DELETE cascade ON UPDATE no action;