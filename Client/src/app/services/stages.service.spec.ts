import { TestBed } from '@angular/core/testing';

import { StagesService } from './stages.service';

describe('StagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StagesService = TestBed.get(StagesService);
    expect(service).toBeTruthy();
  });
});
