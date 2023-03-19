/*
  Warnings:

  - Made the column `address` on table `Listings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bathrooms` on table `Listings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `distanceToUcf` on table `Listings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rooms` on table `Listings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `Listings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipcode` on table `Listings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Listings" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "bathrooms" SET NOT NULL,
ALTER COLUMN "distanceToUcf" SET NOT NULL,
ALTER COLUMN "rooms" SET NOT NULL,
ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "zipcode" SET NOT NULL;
