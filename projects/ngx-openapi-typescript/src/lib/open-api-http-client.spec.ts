import { HttpBackend, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OpenApiHttpClient } from './open-api-http-client';

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

describe('OpenApiHttpClient HTTP client selection', () => {
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([
                    (request, next) => next(request.clone({
                        setHeaders: { 'X-Test-Interceptor': 'applied' },
                    })),
                ])),
                provideHttpClientTesting(),
                TestApiClient,
            ],
        });
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpTesting.verify());

    it('uses the injected client and its interceptors by default', () => {
        const client = TestBed.inject(TestApiClient);
        client.get('/pets').subscribe();

        const request = httpTesting.expectOne('https://api.example.com/pets');
        expect(request.request.headers.get('X-Test-Interceptor')).toBe('applied');
        request.flush([]);
    });

    it('uses an explicit client outside an injection context and bypasses interceptors with HttpBackend', () => {
        const httpClient = new HttpClient(TestBed.inject(HttpBackend));
        // Deliberately construct without TestBed.runInInjectionContext.
        const client = new OpenApiHttpClient<paths>({
            baseUrl: 'https://public.example.com',
            httpClient,
        });
        const pets: Pet[] = [{ id: 1, name: 'Fido' }];
        let received: Pet[] | undefined;

        client.get('/pets', { params: { query: { limit: 5 } } }).subscribe((result) => {
            received = result;
        });

        const request = httpTesting.expectOne('https://public.example.com/pets?limit=5');
        expect(request.request.method).toBe('GET');
        expect(request.request.headers.has('X-Test-Interceptor')).toBe(false);
        request.flush(pets);
        expect(received).toEqual(pets);
    });
});
