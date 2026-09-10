import { Injectable } from '@nestjs/common';
import { CoreHttpService } from '../../common/http/http.service';
import { IApiGetAssetsResponse } from './assets.dto';

@Injectable()
export class AssetsAggregator {
  private base = process.env.CORRETORA_API_URL ?? 'http://localhost:5089';

  constructor(private readonly http: CoreHttpService) {}

  async getAssetsPrice(id: number) {
    return this.http.get<IApiGetAssetsResponse>(
      `${this.base}/assets/${id}/price`,
    );
  }
}
