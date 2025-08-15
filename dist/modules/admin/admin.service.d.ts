import { CreateQuestionDto } from "./dto/create-question.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { QuestionAnswer } from "./dto/question-answer.dto";
export declare class AdminService {
    private db;
    constructor(db: PrismaService);
    createQuestion(createQuestionDto: CreateQuestionDto): Promise<{
        message: string;
        question_id: string;
    }>;
    getQuestions(step_number: number): Promise<({
        options: {
            id: string;
            question_id: string;
            option_text: string;
            option_value: string;
        }[];
    } & {
        id: string;
        question_text: string;
        question_type: import(".prisma/client").$Enums.QuestionType;
        is_required: boolean;
        step_number: number;
    })[]>;
    addAnswerQuestion(questionAnswer: QuestionAnswer): Promise<{
        message: string;
    } | undefined>;
}
