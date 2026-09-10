import { AssetsService } from './assets.service';
import { AssetsAggregator } from '../../aggregators/assets/asset.service';
import { AssetsController } from './assets.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoreHttpService } from '../../common/http/http.service';

@Module({
  imports: [HttpModule],
  controllers: [AssetsController],
  providers: [AssetsService, CoreHttpService, AssetsAggregator],
  exports: [AssetsService],
})
export class AssetsModule {}
