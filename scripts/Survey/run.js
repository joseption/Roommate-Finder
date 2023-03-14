const axios = require("axios");
//import questions
// Replace this with your super user ID and the base URL of your server
const superUserId = "your_superuser_id";
const baseUrl = "http://localhost:8080";

const fs = require("fs");

// Read the questions from the file
const questionsFile = fs.readFileSync("survey.txt", "utf8");

// Split the file content into individual questions
const questionsArray = questionsFile.split(/\n{2,}/g);

// Convert each question to the desired format
const questions = questionsArray.map((question) => {
  const [questionText, ...responses] = question.split(/\n/g);
  return {
    question_text: questionText,
    responses: responses.map((response) => response.trim()),
  };
});

// console.log(questions);

async function getToken(email, password) {
  try {
    const { accessToken, refreshToken } = await axios
      .post(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .then((res) => res.data);
    // console.log({ accessToken, refreshToken });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
}

async function addQuestionAndResponses(
  question,
  responses,
  accessToken,
  refreshToken
) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json",
    };

    const questionId = await axios
      .post(
        `${baseUrl}/survey/utils/add/question`,
        {
          question_text: question,
        },
        { headers }
      )
      .then((res) => res.data.id);

    for (const response of responses) {
      //add auth headers here
      await axios.post(
        `${baseUrl}/survey/utils/add/response`,
        {
          question_id: questionId,
          response: response,
        },
        { headers }
      );
    }

    console.log(`Added question: ${question}`);
  } catch (error) {
    console.error(`Failed to add question: ${question}`, error);
  }
}

(async () => {
  //user has to be superuser to add questions
  const { accessToken, refreshToken } = await getToken(
    "example@email.com",
    "passwordhere"
  );
  for (const questionData of questions) {
    await addQuestionAndResponses(
      questionData.question_text,
      questionData.responses,
      accessToken,
      refreshToken
    );
  }
  // await axios.post(
  //   `${baseUrl}/survey/utils/remove/question`,
  //   {
  //     id: "db508625-86c2-4e14-89bd-ba41a9b17a96",
  //   },
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       contentType: "application/json",
  //     },
  //   }
  // );
})();
