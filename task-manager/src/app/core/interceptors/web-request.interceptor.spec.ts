import { TestBed } from '@angular/core/testing';

import { WebRequestInterceptor } from './web-request.interceptor';

describe('WebRequestInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      WebRequestInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: WebRequestInterceptor = TestBed.inject(WebRequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
