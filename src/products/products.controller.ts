import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICES } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    const res = this.client.send(
      { cmd: 'create_product' },
      createProductDto,
    );
    return res;
  }

  @Get()
  getAllProducts(@Query() paginationDto: PaginationDto) {
    try {
      return this.client.send({ cmd: 'find_all' }, paginationDto);
    } catch (error) {}
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const res = await firstValueFrom(
        this.client.send({ cmd: 'find_one_product' }, { id }),
      );
      return res;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const res = await firstValueFrom(
        this.client.send(
          { cmd: 'update_product' },
          { id, ...updateProductDto },
        ),
      );
      return res;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {

    try {
      const res = await firstValueFrom(
        this.client.send({ cmd: 'delete_product' }, {id}),
      );

      return res;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
