CREATE TYPE "public"."difficulty" AS ENUM('Easy', 'Medium', 'Hard', 'Expert');--> statement-breakpoint
CREATE TYPE "public"."problem_type" AS ENUM('dsa', 'frontend', 'fullstack');--> statement-breakpoint
CREATE TYPE "public"."question_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "question_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_examples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"input" text NOT NULL,
	"output" text NOT NULL,
	"explanation" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_starter_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"language" varchar(50) NOT NULL,
	"code" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_test_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"input" text NOT NULL,
	"expected_output" text NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"is_sample" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"type" "problem_type" DEFAULT 'dsa' NOT NULL,
	"difficulty" "difficulty" DEFAULT 'Medium' NOT NULL,
	"category" varchar(100) DEFAULT 'General' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"companies" text[] DEFAULT '{}' NOT NULL,
	"technology" text[] DEFAULT '{}' NOT NULL,
	"requirements" text[] DEFAULT '{}' NOT NULL,
	"constraints" text[] DEFAULT '{}' NOT NULL,
	"acceptance_rate" double precision DEFAULT 0 NOT NULL,
	"estimated_minutes" integer DEFAULT 30 NOT NULL,
	"time_limit_ms" integer DEFAULT 2000 NOT NULL,
	"memory_limit_mb" integer DEFAULT 256 NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"status" "question_status" DEFAULT 'draft' NOT NULL,
	"created_by" uuid NOT NULL,
	"attempted_count" integer DEFAULT 0 NOT NULL,
	"solved_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "question_bookmarks" ADD CONSTRAINT "question_bookmarks_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_examples" ADD CONSTRAINT "question_examples_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_starter_codes" ADD CONSTRAINT "question_starter_codes_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_test_cases" ADD CONSTRAINT "question_test_cases_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "question_bookmarks_user_question_idx" ON "question_bookmarks" USING btree ("user_id","question_id");--> statement-breakpoint
CREATE INDEX "question_bookmarks_user_id_idx" ON "question_bookmarks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "question_examples_question_id_idx" ON "question_examples" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "question_starter_codes_question_language_idx" ON "question_starter_codes" USING btree ("question_id","language");--> statement-breakpoint
CREATE INDEX "question_test_cases_question_id_idx" ON "question_test_cases" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_slug_idx" ON "questions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "questions_status_idx" ON "questions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "questions_difficulty_idx" ON "questions" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "questions_type_idx" ON "questions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "questions_category_idx" ON "questions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "questions_created_by_idx" ON "questions" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "questions_title_idx" ON "questions" USING btree ("title");