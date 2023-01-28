import { ExtendOptions, Got } from 'got';

export interface IRequestService {
  getInstance(...instancesOrOptions: Array<Got | ExtendOptions>): Got;
}
