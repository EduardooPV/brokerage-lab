import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoreHttpService {
  constructor(private readonly http: HttpService) {}

  async get<T>(url: string): Promise<T> {
    const response = await firstValueFrom(this.http.get<T>(url));
    return response.data;
  }

  async post<T>(
    url: string,
    body: unknown,
    headers: Record<string, string>,
  ): Promise<T> {
    const response = await firstValueFrom(
      this.http.post<T>(url, body, { headers }),
    );
    return response.data;
  }
}
