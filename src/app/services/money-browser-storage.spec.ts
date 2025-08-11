import { TestBed } from '@angular/core/testing';

import { MoneyBrowserStorage } from './money-browser-storage';

describe('MoneyBrowserStorage', () => {
  let service: MoneyBrowserStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoneyBrowserStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
