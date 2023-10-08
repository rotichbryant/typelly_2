import { IsNotEmpty, IsString } from "class-validator";

export class QuestionValidation {

    @IsNotEmpty()
    @IsString()
    question: string
}