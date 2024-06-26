import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

@ApiProperty({
    default:10,
    description:'Limite de productos a regresar'
})
@IsOptional()
@IsPositive()
@Type(()=>Number)
limit?:number;

@ApiProperty({
    default:10,
    description:'numerero de prodcuctos a saltar'
})
@IsOptional()
@Min(0)
@Type(()=>Number)
offset?:number;

}