import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

fdescribe('UtilsService', () => {
  let service: UtilsService;
  beforeEach( () =>{
    service = new UtilsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should receive list of types questions', () => {
    expect(service.getTypesQuestion().length).toBeGreaterThan(0);
  });

  it('should receive list of stages', () => {
    expect(service.getTypesStages().length).toBeGreaterThan(0);
  });
});
