import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageValidation {

    @IsString()
    @IsNotEmpty()
    type: string

    @IsString()
    @IsNotEmpty()
    content: string
    
}