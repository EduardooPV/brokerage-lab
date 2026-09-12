import { Injectable } from '@nestjs/common';
import { CoreHttpService } from '../../common/http/http.service';
import { IApiGetAssetsResponse } from './assets.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AssetsAggregator {
  private base = process.env.CORRETORA_API_URL ?? 'http://localhost:5089';

  constructor(
    private readonly http: CoreHttpService,
    private readonly logger: Logger,
  ) {}

  async getAssetsPrice(id: number) {
    try {
      return this.http.get<IApiGetAssetsResponse>(
        `${this.base}/assets/${id}/price`,
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error({ err }, '[getAssetsPrice]');
      throw error;
    }
  }
}
