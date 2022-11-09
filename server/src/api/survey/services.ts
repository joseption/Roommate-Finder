import db from '../../utils/db';

export async function GetSurveyQuestionsAndResponses(userId: string){
    return await db.question.findMany({
        select: {
            id: true,
            question_text: true,
            question_text_short: true,
            response: true,
            ResponsesOnUsers: {
                where: {
                    userId,
                },
                select: {
                    responseId: true,
                    response: true
                }
        }
        },
    })
}

export async function UserAnswer(userId: string, questionId:string, responseId: string){
    const update = await db.responsesOnUsers.updateMany({
        where: {
            userId,
            questionId,
        },
        data: {
            responseId,
        }
      });

    if(update.count == 0){
        return await db.responsesOnUsers.create({
            data: {
                userId,
                questionId,
                responseId,
            }
        });
    }
    else{
        return update;
    }
}