-- CreateTable
CREATE TABLE "installs" (
    "id" TEXT NOT NULL,
    "idSource" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "version" TEXT NOT NULL,
    "build" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "osVersion" TEXT NOT NULL,
    "arch" TEXT NOT NULL,
    "betaExpiresAt" TIMESTAMP(3),
    "betaState" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "statusMessage" TEXT,
    "betaRefreshedAt" TIMESTAMP(3),
    "betaExpiresAtOverride" TIMESTAMP(3),
    "betaRefreshCount" INTEGER NOT NULL DEFAULT 0,
    "supersededById" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "command_usage_daily" (
    "installId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "verb" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "command_usage_daily_pkey" PRIMARY KEY ("installId","day","verb","source")
);

-- CreateIndex
CREATE INDEX "installs_lastSeenAt_idx" ON "installs"("lastSeenAt");

-- CreateIndex
CREATE INDEX "installs_channel_lastSeenAt_idx" ON "installs"("channel", "lastSeenAt");

-- CreateIndex
CREATE INDEX "installs_status_idx" ON "installs"("status");

-- CreateIndex
CREATE INDEX "command_usage_daily_day_idx" ON "command_usage_daily"("day");

-- CreateIndex
CREATE INDEX "command_usage_daily_verb_day_idx" ON "command_usage_daily"("verb", "day");

-- AddForeignKey
ALTER TABLE "command_usage_daily" ADD CONSTRAINT "command_usage_daily_installId_fkey" FOREIGN KEY ("installId") REFERENCES "installs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
