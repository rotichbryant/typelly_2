import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePromptValidation {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

}