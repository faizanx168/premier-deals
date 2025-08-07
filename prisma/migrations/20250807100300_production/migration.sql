/*
  Warnings:

  - The values [AVAILABLE,OFF_MARKET] on the enum `PropertyStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [HOUSE,APARTMENT,CONDO,TOWNHOUSE,COMMERCIAL] on the enum `PropertyType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `icon` on the `amenities` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `properties` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `area` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `alt` on the `property_images` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `property_images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `propertyId` on table `inquiries` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertyStatus_new" AS ENUM ('ACTIVE', 'PENDING', 'SOLD', 'RENTED');
ALTER TABLE "properties" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "properties" ALTER COLUMN "status" TYPE "PropertyStatus_new" USING ("status"::text::"PropertyStatus_new");
ALTER TYPE "PropertyStatus" RENAME TO "PropertyStatus_old";
ALTER TYPE "PropertyStatus_new" RENAME TO "PropertyStatus";
DROP TYPE "PropertyStatus_old";
ALTER TABLE "properties" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyType_new" AS ENUM ('SALE', 'RENT', 'LAND');
ALTER TABLE "properties" ALTER COLUMN "type" TYPE "PropertyType_new" USING ("type"::text::"PropertyType_new");
ALTER TYPE "PropertyType" RENAME TO "PropertyType_old";
ALTER TYPE "PropertyType_new" RENAME TO "PropertyType";
DROP TYPE "PropertyType_old";
COMMIT;

-- AlterEnum - Add USER value first
ALTER TYPE "UserRole" ADD VALUE 'USER';

-- DropForeignKey
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_propertyId_fkey";

-- AlterTable
ALTER TABLE "amenities" DROP COLUMN "icon",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "inquiries" ALTER COLUMN "propertyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "country",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "area" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "zipCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "property_images" DROP COLUMN "alt",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;

-- Now set the default after the enum value has been added
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "users"("resetToken");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE; 