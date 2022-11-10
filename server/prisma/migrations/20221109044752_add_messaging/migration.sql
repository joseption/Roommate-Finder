-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN,
    "is_superuser" BOOLEAN,
    "is_verified" BOOLEAN,
    "image" TEXT,
    "gender" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "birthday" TIMESTAMP(3),
    "phone_number" INTEGER,
    "zip_code" INTEGER,
    "city" TEXT,
    "state" TEXT,
    "reset_id" INTEGER,
    "reset_exp" TIMESTAMP(3),
    "update_id" INTEGER,
    "update_exp" TIMESTAMP(3),
    "activate_id" INTEGER,
    "activate_exp" TIMESTAMP(3),
    "is_setup" BOOLEAN,
    "setup_step" TEXT,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_text_short" TEXT NOT NULL,
    "is_filter" BOOLEAN NOT NULL,
    "response_id" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "response" TEXT,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interests_Activity" (
    "option_id" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Interests_Activity_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "User_Interests_Activity" (
    "user_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "User_Interests_Activity_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ResponsesOnUsers" (
    "userId" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Listings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT[],
    "city" TEXT NOT NULL,
    "housing_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "petsAllowed" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "Listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "chatName" TEXT NOT NULL,
    "isGroupChat" BOOLEAN NOT NULL,
    "users" TEXT[],
    "latestMessage" TEXT NOT NULL,
    "groupAdmin" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_id_key" ON "RefreshToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ResponsesOnUsers_userId_responseId_questionId_key" ON "ResponsesOnUsers"("userId", "responseId", "questionId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsesOnUsers" ADD CONSTRAINT "ResponsesOnUsers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsesOnUsers" ADD CONSTRAINT "ResponsesOnUsers_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsesOnUsers" ADD CONSTRAINT "ResponsesOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
