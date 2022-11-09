import db from '../../utils/db';

//will be used for matches, gets all questions and responses for all users.
export async function GetAllSurveyQuestionsAndResponses(){
    return await db.question.findMany({
        select: {
            id: true,
            question_text: true,
            response: true,
            ResponsesOnUsers: {
                select: {
                    responseId: true,
                    response: true
                }
        }
        },
    })
}

//gets a users questions and responses. 
export async function GetSurveyQuestionsAndResponses(userId: string){
    return await db.question.findMany({
        select: {
            id: true,
            question_text: true,
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

export async function AddQuestion(question_text: string){
    return await db.question.create({
        data: {
            question_text,
        }
    });
}

export async function RemoveQuestion(id: string){
    await db.response.deleteMany({
        where: {
            question_id: id,
        }
    })
    return await db.question.delete({
        where: {
            id,
        }
    });
}

export async function AddResponse(response: string, question_id: string){
    return await db.response.create({
        data: {
            response,
            question_id,
        }
    });
}

export async function RemoveResponse(id: string){
    return await db.response.delete({
        where: {
            id,
        }
    });
}