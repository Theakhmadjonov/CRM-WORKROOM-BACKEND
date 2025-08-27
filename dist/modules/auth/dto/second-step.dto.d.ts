export declare class SecondStepDto {
    question_id: string;
    answer_text?: string;
    option_id?: string;
}
export declare class ThirdStepDto {
    question_id: string;
    answer_text?: string;
    option_id?: string;
}
export declare class FourthStepDto {
    emails: string[];
}
export declare class SignUpDto {
    email: string;
    password: string;
    phone: string;
    secondStepData: SecondStepDto[];
    thirdStepData: ThirdStepDto[];
    fourthStepData: FourthStepDto;
}
