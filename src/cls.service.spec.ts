import { ClsService } from './cls.service';
import { emitter } from 'nock';

describe('ClsService', () => {
  let service: ClsService;
  let setSpy: jest.SpyInstance;
  let getSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new ClsService();
    setSpy = jest.spyOn(service, 'set');
    getSpy = jest.spyOn(service, 'get');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set', () => {
    it('should set a value with a key', () => {
      service.run(() => {
        service.set('key', 'value');
        const value = service.get('key');
        expect(value).toBe('value');
      });
    });
  });

  describe('get', () => {
    it('should get a value with a key', () => {
      service.run(() => {
        service.set('key', 'value');
        const value = service.get('key');
        expect(value).toBe('value');
      });
    });

    it('should return undefined if key does not exist', () => {
      service.run(() => {
        const value = service.get('nonexistent-key');
        expect(value).toBeUndefined();
      });
    });
  });

  describe('run', () => {
    it('should run a callback and return its result', () => {
      const result = service.run(() => 'result');
      expect(result).toBe('result');
    });
  });

  describe('bindEmitter', () => {
    it('should call the namespace bindEmitter method with the correct parameters', () => {
      const namespaceSpy = jest.spyOn(service, 'bindEmitter');
      service.bindEmitter(emitter);
      expect(namespaceSpy).toHaveBeenCalledWith(emitter);
    });
  });
});
