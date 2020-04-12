import { TestBed } from '@angular/core/testing';

import { AssetsService } from './assets.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

fdescribe('AssetsService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let assetsService: AssetsService;
  const expectedResp: any[] = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    assetsService = new AssetsService(<any> httpClientSpy);
  });

  it('should return expected locales (HttpClient called once)', () => {

    httpClientSpy.get.and.returnValue(of(expectedResp));

    assetsService.getMyLocales().subscribe(
      locales => expect(locales).toEqual(expectedResp, 'expected heroes'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return an error when the server returns a 404', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(throwError(errorResponse));

    assetsService.getMyLocales().subscribe(
      locales => fail('expected an error, not locales'),
      error  => expect(error.status).toEqual(404)
    );
  });

  it('should return expected domains (HttpClient called once)', () => {

    httpClientSpy.get.and.returnValue(of(expectedResp));

    assetsService.getMyDomains().subscribe(
      domains => expect(domains).toEqual(expectedResp, 'expected heroes'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return expected tasks (HttpClient called once)', () => {

    httpClientSpy.get.and.returnValue(of(expectedResp));

    assetsService.getMyTasks().subscribe(
      tasks => expect(tasks).toEqual(expectedResp, 'expected heroes'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});
