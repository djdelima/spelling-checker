import { CorsMiddleware } from './cors.middleware';
import { Request, Response } from 'express';

describe('CorsMiddleware', () => {
  let middleware: CorsMiddleware;
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new CorsMiddleware();
    req = {} as Request;
    res = { header: jest.fn() } as unknown as Response;
    next = jest.fn();
  });

  it('should add CORS headers to the response', () => {
    middleware.use(req, res, next);
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://spelling-checker-front.herokuapp.com',
    );
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Headers',
      '*',
    );
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Methods',
      '*',
    );
  });

  it('should call the next function', () => {
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
