import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterValidation {
  @IsNotEmpty()
  first_name: string

  @IsNotEmpty()
  last_name: string

  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{ message: "Enter a valid email address."})
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak.'})
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4,{message:"Password confirmation should not be less than 4 characters." })
  @Matches(RegisterValidation['password'],{message: "Password confirmation should match the password."})
  confirm_password: string;
}