import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createOpenApiResource } from './open-api-resource';

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
    };
}

interface Pet {
    id: number;
    name: string;
}

interface NewPet {
    name: string;
}

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
        const openapiResource = TestBed.runInInjectionContext(() =>
            createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
        );

        TestBed.runInInjectionContext(() => openapiResource('/pets', () => ({})));

        TestBed.tick();
        const req = httpTesting.expectOne('https://api.example.com/pets');
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('makes a GET request without requestFn', () => {
        const openapiResource = TestBed.runInInjectionContext(() =>
            createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
        );

        TestBed.runInInjectionContext(() => openapiResource('/pets'));

        TestBed.tick();
        const req = httpTesting.expectOne('https://api.example.com/pets');
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('GET resource includes query params', () => {
        const openapiResource = TestBed.runInInjectionContext(() =>
            createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
        );

        TestBed.runInInjectionContext(() =>
            openapiResource('/pets', () => ({ params: { query: { limit: 5 } } })),
        );

        TestBed.tick();
        const req = httpTesting.expectOne(
            (r) =>
                r.url === 'https://api.example.com/pets' && r.params.get('limit') === '5',
        );
        req.flush([]);
    });

    it('GET resource substitutes path params into the URL', () => {
        const openapiResource = TestBed.runInInjectionContext(() =>
            createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
        );

        TestBed.runInInjectionContext(() =>
            openapiResource('/pets/{petId}', () => ({ params: { path: { petId: 42 } } })),
        );

        TestBed.tick();
        const req = httpTesting.expectOne('https://api.example.com/pets/42');
        expect(req.request.method).toBe('GET');
        req.flush({ id: 42, name: 'Rex' });
    });

    it('resource is idle and makes no request when requestFn returns undefined', () => {
        const openapiResource = TestBed.runInInjectionContext(() =>
            createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
        );

        const enabled = signal(false);
        const resource = TestBed.runInInjectionContext(() =>
            openapiResource('/pets', () => (enabled() ? {} : undefined)),
        );

        TestBed.tick();
        httpTesting.expectNone('https://api.example.com/pets');
        expect(resource.isLoading()).toBe(false);
    });

    it('POST resource sends correct method and body', () => {
        const openapiResource = TestBed.runInInjectionContext(() =>
            createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
        );
        const newPet: NewPet = { name: 'Buddy' };

        TestBed.runInInjectionContext(() =>
            openapiResource('/pets', () => ({ body: newPet }), { method: 'post' }),
        );

        TestBed.tick();
        const req = httpTesting.expectOne('https://api.example.com/pets');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newPet);
        req.flush({ id: 2, name: 'Buddy' });
    });

    it('resource re-fetches when signal changes', () => {
        const openapiResource = TestBed.runInInjectionContext(() =>
            createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' }),
        );
        const petId = signal(1);

        TestBed.runInInjectionContext(() =>
            openapiResource('/pets/{petId}', () => ({ params: { path: { petId: petId() } } })),
        );

        TestBed.tick();
        httpTesting.expectOne('https://api.example.com/pets/1').flush({ id: 1, name: 'Fido' });

        petId.set(2);
        TestBed.tick();
        httpTesting.expectOne('https://api.example.com/pets/2').flush({ id: 2, name: 'Rex' });
    });
});
