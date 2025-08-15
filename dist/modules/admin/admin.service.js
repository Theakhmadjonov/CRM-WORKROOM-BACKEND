"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
let AdminService = class AdminService {
    db;
    constructor(db) {
        this.db = db;
    }
    async createQuestion(createQuestionDto) {
        const question = await this.db.prisma.userProfileQuestions.create({
            data: {
                question_text: createQuestionDto.question_text,
                question_type: createQuestionDto.question_type,
                is_required: createQuestionDto.is_required ? true : false,
                step_number: createQuestionDto.step_number,
            },
        });
        if (createQuestionDto?.options.length >= 1) {
            const options = createQuestionDto.options.map(({ option_text, option_value }) => {
                return this.db.prisma.questionOptions.create({
                    data: {
                        question_id: question.id,
                        option_text,
                        option_value,
                    },
                });
            });
            await Promise.all([...options]);
        }
        return {
            message: "success",
            question_id: question.id,
        };
    }
    async getQuestions(step_number) {
        const questions = await this.db.prisma.userProfileQuestions.findMany({
            where: {
                step_number,
            },
            include: {
                options: true,
            },
        });
        return questions;
    }
    async addAnswerQuestion(questionAnswer) {
        await this.db.prisma.userProfileQuestionAnswers.create({
            data: {
                answer_text: questionAnswer.answer_text,
                question_id: questionAnswer.question_id,
            },
        });
        if (questionAnswer?.answer_options) {
            const answerOptions = questionAnswer.answer_options.map(({ answer_id, option_id }) => {
                return this.db.prisma.selectedAnswerOptions.create({
                    data: {
                        option_id,
                        answer_id,
                    },
                });
            });
            await Promise.all([...answerOptions]);
            return {
                message: "Answers added",
            };
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map