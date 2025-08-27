import { AdminService } from "./admin.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createQuestion(createQuestionDto: CreateQuestionDto): Promise<{
        message: string;
        question_id: string;
    }>;
    getQuestions(step_number: string): Promise<({
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
}
