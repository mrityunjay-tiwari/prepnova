-- AlterTable
ALTER TABLE "InterviewReport"
ADD COLUMN     "actionPlan" JSONB,
ADD COLUMN     "communicationSummary" TEXT,
ADD COLUMN     "flowUsed" JSONB,
ADD COLUMN     "postureSummary" TEXT,
ADD COLUMN     "readinessLevel" TEXT,
ADD COLUMN     "sectionBreakdown" JSONB,
ADD COLUMN     "seniority" TEXT;
