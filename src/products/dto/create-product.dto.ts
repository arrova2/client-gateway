import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    public name: string;

    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    // Para transformarlo a un Number aunque venga como string
    @Type( () => Number )
    public price: number;

}
