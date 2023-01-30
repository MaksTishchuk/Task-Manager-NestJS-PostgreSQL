import {IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class AuthCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  // Regular expression for contains password 1 Big, 1 small letter and 1 number
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {message: 'Password too week'})
  password: string
}