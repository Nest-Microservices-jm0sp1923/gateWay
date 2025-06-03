import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_SERVICE, envs } from 'src/config';

@Module({
  controllers: [OrdersController],
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: "localhost", // envs.ordersMicroservicesHost,
          port: 3002, // envs.ordersMicroservicesPort
        },
      },
    ]),
  ],
})
export class OrdersModule {}
