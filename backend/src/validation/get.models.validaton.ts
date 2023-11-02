import { IsNotEmpty, IsString } from "class-validator";

export class GetModelsValidation {

    @IsString()
    @IsNotEmpty()
    apiKey: string
    
}