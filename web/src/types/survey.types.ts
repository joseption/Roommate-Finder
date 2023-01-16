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
  id: string;
  question_text: string;
  response: response[];
}
