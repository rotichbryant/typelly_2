import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class SitemapValidation {

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url: string
    
}