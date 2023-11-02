import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateIf, ValidateNested } from 'class-validator';
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

  @IsNotEmpty()
  @IsString()
  model: string

  @IsNotEmpty()
  @IsString()
  content_type: string

  @IsNotEmpty()
  @IsString()
  api_key: string

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PromptParam)
  prompts: PromptParam[]

  @ValidateIf( o => o.content_type == "documents")
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Array)
  files: []

  @ValidateIf( o => o.content_type == "sitemap")
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Array)
  sitemap: []

  @ValidateIf( o => o.content_type == "website")
  @IsNotEmpty()
  @IsString()
  website_url: string
}