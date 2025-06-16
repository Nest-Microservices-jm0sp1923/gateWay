import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICES } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const response = await firstValueFrom(
        this.client.send('createOrder', createOrderDto),
      );
      return response;
    } catch (error) {
      let errorMessage = 'Unexpected error';
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      // Si el error es un JSON serializado por RpcException
      if (typeof error.message === 'string') {
        try {
          const parsed = JSON.parse(error.message);
          errorMessage = parsed.message || errorMessage;
          statusCode = parsed.status || statusCode;
        } catch (_) {
          errorMessage = error.message;
        }
      }

      throw new HttpException(
        { status: 'error', message: errorMessage },
        statusCode,
      );
    }
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.client.send('changeOrderStatus', {
        id,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
