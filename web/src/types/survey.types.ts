export interface response {
  id: string;
  response: string;
  question_id: string;
}

export interface ResponsesOnUsers {
  responseId: string;
  response: response;
}

export interface SurveyInfo {
  ResponsesOnUsers: ResponsesOnUsers[];
  id: string;
  question_text: string;
  response: response[];
}
