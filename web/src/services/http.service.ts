import axios, { type AxiosInstance } from "axios";
import { refreshToken } from "../auth/auth.service";
import router from "../router";

export class HttpService {
  private baseUrl: string;
  private instance: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.instance = axios.create({ baseURL: this.baseUrl });

    this.instance.interceptors.request.use((request) => {
      const token = sessionStorage.getItem("access-token");

      request.headers.Authorization = `Bearer ${token}`;

      return request;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.message === "TOKEN_EXPIRED"
        ) {
          await refreshToken();
          return this.instance(error.config);
        }

        return Promise.reject(error);
      },
    );
  }

  public async get<T>(url: string): Promise<T> {
    const response = await this.instance.get<T>(url);

    return response.data;
  }

  public async post<T>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await this.instance.post<T>(url, body, { headers });

    return response.data;
  }
}
