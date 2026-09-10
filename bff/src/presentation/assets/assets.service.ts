import { Injectable } from '@nestjs/common';
import { AssetsAggregator } from '../../aggregators/assets/asset.service';
import { IAssetResponse } from './assets.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly assetAggregators: AssetsAggregator) {}

  public async getAssetsPrice(id: number): Promise<IAssetResponse> {
    return await this.assetAggregators.getAssetsPrice(id);
  }
}
