import { QuestionType } from '@prisma/client';
interface IOptions {
    option_text: string;
    option_value: string;
}
export declare class CreateQuestionDto {
    question_text: string;
    question_type: QuestionType;
    is_required: Boolean;
    step_number: number;
    options: Array<IOptions>;
}
export {};
