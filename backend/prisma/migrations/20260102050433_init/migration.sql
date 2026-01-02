/*
  Warnings:

  - You are about to drop the column `dailyOverviewId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `DailyOverview` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_dailyOverviewId_fkey";

-- DropIndex
DROP INDEX "Booking_dailyOverviewId_idx";

-- DropIndex
DROP INDEX "Booking_dailyOverviewId_roomId_startTime_endTime_key";

-- DropIndex
DROP INDEX "Booking_roomId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "dailyOverviewId",
ADD COLUMN     "courseDate" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "DailyOverview";

-- CreateIndex
CREATE INDEX "Booking_courseDate_idx" ON "Booking"("courseDate");

-- CreateIndex
CREATE INDEX "Booking_roomId_courseDate_idx" ON "Booking"("roomId", "courseDate");
