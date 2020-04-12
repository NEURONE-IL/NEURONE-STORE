import { TestBed } from '@angular/core/testing';

import { PublishesService } from './publishes.service';

describe('PublishesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublishesService = TestBed.get(PublishesService);
    expect(service).toBeTruthy();
  });
});
