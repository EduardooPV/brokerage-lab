import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @UseGuards(AuthGuard)
  @Get(':id/price')
  async getAssetsPrice(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.getAssetsPrice(id);
  }
}
