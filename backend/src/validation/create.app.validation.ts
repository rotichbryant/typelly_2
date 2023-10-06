import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PromptParam } from './types/prompt.param';

export class CreateAppValidation {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  welcome_message: string

  @IsNotEmpty()
  @IsString()
  input_placeholder: string

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => PromptParam)
  prompts: PromptParam[]
}