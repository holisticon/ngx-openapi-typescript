import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { createOpenApiResource } from './open-api-resource';
import { OpenApiHttpClient } from './open-api-http-client';
import { buildUrl, toHttpParams } from './open-api-resource';

// Minimal test schema (mirrors openapi-typescript generated types)
interface paths {
  '/pets': {
    get: {
      parameters: {
        query?: { limit?: number; offset?: number };
      };
      responses: {
        200: { content: { 'application/json': Pet[] } };
      };
    };
    post: {
      parameters: Record<string, never>;
      requestBody: {
        content: { 'application/json': NewPet };
      };
      responses: {
        201: { content: { 'application/json': Pet } };
      };
    };
  };
  '/pets/{petId}': {
    get: {
      parameters: {
        path: { petId: number };
      };
      responses: {
        200: { content: { 'application/json': Pet } };
      };
    };
    put: {
      parameters: {
        path: { petId: number };
      };
      requestBody: {
        content: { 'application/json': NewPet };
      };
      responses: {
        200: { content: { 'application/json': Pet } };
      };
    };
    delete: {
      parameters: {
        path: { petId: number };
      };
      responses: {
        204: { content: never };
      };
    };
  };
}

interface Pet {
  id: number;
  name: string;
}

interface NewPet {
  name: string;
}

// ─── Unit tests: buildUrl & toHttpParams ────────────────────────────────────

describe('buildUrl', () => {
  it('appends the path to the base URL', () => {
    expect(buildUrl('https://api.example.com', '/pets')).toBe(
      'https://api.example.com/pets',
    );
  });

  it('substitutes path parameters', () => {
    expect(buildUrl('https://api.example.com', '/pets/{petId}', { petId: 42 })).toBe(
      'https://api.example.com/pets/42',
    );
  });

  it('URI-encodes path parameter values', () => {
    expect(buildUrl('', '/items/{name}', { name: 'hello world' })).toBe(
      '/items/hello%20world',
    );
  });

  it('works without a base URL', () => {
    expect(buildUrl('', '/pets')).toBe('/pets');
  });

  it('substitutes multiple path parameters', () => {
    expect(
      buildUrl('', '/a/{x}/b/{y}', { x: 'foo', y: 'bar' }),
    ).toBe('/a/foo/b/bar');
  });
});

describe('toHttpParams', () => {
  it('returns undefined for undefined input', () => {
    expect(toHttpParams(undefined)).toBeUndefined();
  });

  it('sets scalar query params', () => {
    const params = toHttpParams({ limit: 10, offset: 0 });
    expect(params?.get('limit')).toBe('10');
    expect(params?.get('offset')).toBe('0');
  });

  it('appends array query params', () => {
    const params = toHttpParams({ ids: [1, 2, 3] });
    expect(params?.getAll('ids')).toEqual(['1', '2', '3']);
  });

  it('skips null and undefined values', () => {
    const params = toHttpParams({ a: null, b: undefined, c: 'ok' });
    expect(params?.has('a')).toBe(false);
    expect(params?.has('b')).toBe(false);
    expect(params?.get('c')).toBe('ok');
  });
});

// ─── Integration tests: OpenApiHttpClient ───────────────────────────────────

@Injectable()
class TestApiClient extends OpenApiHttpClient<paths> {
  constructor() {
    super({ baseUrl: 'https://api.example.com' });
  }
}

describe('OpenApiHttpClient', () => {
  let client: TestApiClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TestApiClient],
    });
    client = TestBed.inject(TestApiClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('GET /pets without options', () => {
    const mockPets: Pet[] = [{ id: 1, name: 'Fido' }];
    client.get('/pets').subscribe((pets) => {
      expect(pets).toEqual(mockPets);
    });
    const req = httpTesting.expectOne('https://api.example.com/pets');
    expect(req.request.method).toBe('GET');
    req.flush(mockPets);
  });

  it('GET /pets with query params', () => {
    client.get('/pets', { params: { query: { limit: 5 } } }).subscribe();
    const req = httpTesting.expectOne(
      (r) =>
        r.url === 'https://api.example.com/pets' && r.params.get('limit') === '5',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('GET /pets/{petId} substitutes path param', () => {
    const mockPet: Pet = { id: 42, name: 'Rex' };
    client.get('/pets/{petId}', { params: { path: { petId: 42 } } }).subscribe((pet) => {
      expect(pet).toEqual(mockPet);
    });
    const req = httpTesting.expectOne('https://api.example.com/pets/42');
    expect(req.request.method).toBe('GET');
    req.flush(mockPet);
  });

  it('POST /pets sends body', () => {
    const newPet: NewPet = { name: 'Buddy' };
    const created: Pet = { id: 2, name: 'Buddy' };
    client.post('/pets', { body: newPet }).subscribe((pet) => {
      expect(pet).toEqual(created);
    });
    const req = httpTesting.expectOne('https://api.example.com/pets');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPet);
    req.flush(created);
  });

  it('PUT /pets/{petId} sends body and substitutes path param', () => {
    const updated: Pet = { id: 1, name: 'Fido Updated' };
    client
      .put('/pets/{petId}', { params: { path: { petId: 1 } }, body: { name: 'Fido Updated' } })
      .subscribe((pet) => expect(pet).toEqual(updated));
    const req = httpTesting.expectOne('https://api.example.com/pets/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('DELETE /pets/{petId} makes a DELETE request', () => {
    client.delete('/pets/{petId}', { params: { path: { petId: 1 } } }).subscribe();
    const req = httpTesting.expectOne('https://api.example.com/pets/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

// ─── Integration tests: createOpenApiResource ───────────────────────────────

describe('createOpenApiResource', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('makes a GET request to the correct URL', () => {
    const api = TestBed.runInInjectionContext(() =>
      createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
    );

    TestBed.runInInjectionContext(() => api.get('/pets', () => ({})));

    TestBed.tick();
    const req = httpTesting.expectOne('https://api.example.com/pets');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('GET resource includes query params', () => {
    const api = TestBed.runInInjectionContext(() =>
      createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
    );

    TestBed.runInInjectionContext(() =>
      api.get('/pets', () => ({ params: { query: { limit: 5 } } })),
    );

    TestBed.tick();
    const req = httpTesting.expectOne(
      (r) =>
        r.url === 'https://api.example.com/pets' && r.params.get('limit') === '5',
    );
    req.flush([]);
  });

  it('GET resource substitutes path params into the URL', () => {
    const api = TestBed.runInInjectionContext(() =>
      createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
    );

    TestBed.runInInjectionContext(() =>
      api.get('/pets/{petId}', () => ({ params: { path: { petId: 42 } } })),
    );

    TestBed.tick();
    const req = httpTesting.expectOne('https://api.example.com/pets/42');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 42, name: 'Rex' });
  });

  it('resource is idle and makes no request when requestFn returns undefined', () => {
    const api = TestBed.runInInjectionContext(() =>
      createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
    );

    const enabled = signal(false);
    const resource = TestBed.runInInjectionContext(() =>
      api.get('/pets', () => (enabled() ? {} : undefined)),
    );

    TestBed.tick();
    httpTesting.expectNone('https://api.example.com/pets');
    expect(resource.isLoading()).toBe(false);
  });

  it('POST resource sends correct method and body', () => {
    const api = TestBed.runInInjectionContext(() =>
      createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
    );
    const newPet: NewPet = { name: 'Buddy' };

    TestBed.runInInjectionContext(() =>
      api.post('/pets', () => ({ body: newPet })),
    );

    TestBed.tick();
    const req = httpTesting.expectOne('https://api.example.com/pets');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPet);
    req.flush({ id: 2, name: 'Buddy' });
  });

  it('resource re-fetches when signal changes', () => {
    const api = TestBed.runInInjectionContext(() =>
      createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
    );
    const petId = signal(1);

    TestBed.runInInjectionContext(() =>
      api.get('/pets/{petId}', () => ({ params: { path: { petId: petId() } } })),
    );

    TestBed.tick();
    httpTesting.expectOne('https://api.example.com/pets/1').flush({ id: 1, name: 'Fido' });

    petId.set(2);
    TestBed.tick();
    httpTesting.expectOne('https://api.example.com/pets/2').flush({ id: 2, name: 'Rex' });
  });
});
