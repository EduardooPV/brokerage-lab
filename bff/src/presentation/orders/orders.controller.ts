import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorators';
import type { ICreateOrderRequest } from './orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createOrder(
    @Body() body: ICreateOrderRequest,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    return this.ordersService.createOrder(body, idempotencyKey);
  }
}
