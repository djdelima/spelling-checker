import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { ClsService } from '~/cls.service';

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  let clsService: ClsService;
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    clsService = {
      set: jest.fn(),
    } as any;

    middleware = new CorrelationIdMiddleware(clsService);

    req = {
      header: jest.fn(),
    } as any;

    res = {
      setHeader: jest.fn(),
    } as any;

    next = jest.fn();
  });

  it('should set the x-correlation-id header if it is present in the request', () => {
    req.header.mockReturnValue('test-id');
    middleware.use(req, res, next);
    expect(req.header).toHaveBeenCalledWith('x-correlation-id');
    expect(res.setHeader).toHaveBeenCalledWith('x-correlation-id', 'test-id');
    expect(clsService.set).toHaveBeenCalledWith('cid', 'test-id');
    expect(next).toHaveBeenCalled();
  });

  it('should generate a new x-correlation-id if it is not present in the request', () => {
    req.header.mockReturnValue(null);
    middleware.use(req, res, next);
    expect(req.header).toHaveBeenCalledWith('x-correlation-id');
    expect(res.setHeader).toHaveBeenCalled();
    expect(clsService.set).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
