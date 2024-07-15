import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    // Injectamos el servicio del microservicio de producto
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  createProducts(@Body() createProductDto: CreateProductDto ){
    return this.client.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAllProducts( @Query() paginationDto: PaginationDto ) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto); //{limit:2 page: 3});
    // return 'Esta función regresa varios productos';
  }

  @Get(':id')
  async findOne(@Param('id') id:string) {
    // primer intento
    // console.log(id);
    // return this.productsClient.send({ cmd: 'find_one_product' }, { id });

    // segundo intento más legible
    // try{
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   );

    //   return product;

    // } catch ( error ) {
    // //   throw new BadRequestException(error);
    //   throw new RpcException(error);
    // }

    // tercer intento más complejo
    return this.client.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err)})
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id:string) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError( err => { throw new RpcException(err)})
    );
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id:string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.client.send({ cmd: 'update_product' }, {
      id,
      ...updateProductDto
    }).pipe(
      catchError( err => { throw new RpcException(err)})
    );
  }

}
