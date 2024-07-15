import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE, envs } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersController],
  imports: [
    NatsModule,
    // ClientsModule.register([
    //   {
    //     name: ORDER_SERVICE, 
    //     transport: Transport.TCP,
    //     options: {
    //       // host: envs.ordersMicroserviceHost,
    //       // port: envs.ordersMicroservicePort,
    //     }
    //   },
    // ]),
  ]
})
export class OrdersModule {}
