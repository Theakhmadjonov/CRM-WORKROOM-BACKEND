interface IAnswerOptions {
    answer_id: string;
    option_id: string;
}
export declare class QuestionAnswer {
    question_id: string;
    answer_text: string;
    answer_options: Array<IAnswerOptions>;
}
export {};
