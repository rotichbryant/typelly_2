import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAppValidation {

  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  welcome_message: string

  @IsOptional()
  @IsString()
  input_placeholder: string

  @IsOptional()
  @IsBoolean()
  publish: boolean
}