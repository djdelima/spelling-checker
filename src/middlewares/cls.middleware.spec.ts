import { ClsMiddleware } from './cls.middleware';
import { ClsService } from '../cls.service';
import { Request, Response, NextFunction } from 'express';

describe('ClsMiddleware', () => {
  let middleware: ClsMiddleware;
  let clsService: ClsService;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    clsService = new ClsService();
    jest.spyOn(clsService, 'bindEmitter').mockImplementation(jest.fn());
    jest.spyOn(clsService, 'run').mockImplementationOnce((cb: any) => cb());
    middleware = new ClsMiddleware(clsService);
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
  });

  it('should bind the req and res emitters to the CLS service', () => {
    middleware.use(req, res, next);
    expect(clsService.bindEmitter).toHaveBeenCalledWith(req);
    expect(clsService.bindEmitter).toHaveBeenCalledWith(res);
  });

  it('should run the next function inside the CLS context', () => {
    middleware.use(req, res, next);
    expect(clsService.run).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(clsService.run).toHaveBeenCalledWith(expect.any(Function));
  });
});
