import {
  Got,
  HTTPAlias,
  OptionsOfJSONResponseBody,
  Response,
} from 'got/dist/source';

export interface IGenericClient {
  getName(): string;

  call<T>(
    method: HTTPAlias,
    url: string,
    options: OptionsOfJSONResponseBody,
  ): Promise<Response<T>>;

  getGotInstance(): Promise<Got>;

  // health(): Promise<Response<HealthResponse>>;

  // version(): Promise<Response<VersionResponse>>;
}

export interface IGenericAuthClient extends IGenericClient {
  callWithAuth<T>(
    method: HTTPAlias,
    url: string,
    options: OptionsOfJSONResponseBody,
  ): Promise<Response<T>>;

  getGotInstanceWithAuth(): Promise<Got>;
}
