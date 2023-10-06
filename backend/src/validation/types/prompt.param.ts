import { IsString } from "class-validator";

export class PromptParam {  
    @IsString()
    description: string;

    @IsString()
    title: string;
}