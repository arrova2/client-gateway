import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}
  

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAllOrders( @Query() orderPaginationDto: OrderPaginationDto ) {
    try {

      const orders = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto)
      )

      return orders;
    } catch ( error ){
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    try{
      
      const order = await firstValueFrom( 
        this.client.send('findOneOrder', { id })
      );

      return order;
    }catch(error){
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findOneOrderByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try{
      
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      })
      // const order = await firstValueFrom( 
      //   this.ordersClient.send('findOneOrder', { id })
      // );

      // return order;
    }catch(error){
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() statusDto: StatusDto
  ){
    try{
      return this.client.send('changeOrderStatus', { id, status: statusDto.status });
    }catch(error){
      throw new RpcException(error);
    }
  }

}
