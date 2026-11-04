import {
  HttpContext,
  HttpContextToken,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
  provideHttpClient,
  type HttpEvent,
  type HttpResourceRef,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Observable } from 'rxjs';
import { expectTypeOf } from 'vitest';
import { OpenApiHttpClient } from './open-api-http-client';
import { createOpenApiResource, type OpenApiResource } from './open-api-resource';
import type { OpenApiHttpRequestOptions, OpenApiObserve, OpenApiResponseType } from './types';

interface Pet {
  id: number;
  name: string;
}
interface Operation {
  parameters: { path: { id: number }; query?: { limit?: number } };
  responses: { 200: { content: { 'application/json': Pet } } };
}
type Paths = {
  '/pets/{id}': {
    get: Operation;
    post: Operation & { requestBody: { content: { 'application/json': Pet } } };
    put: Operation & { requestBody: { content: { 'application/json': Pet } } };
    patch: Operation & { requestBody: { content: { 'application/json': Pet } } };
    delete: Operation & { requestBody: { content: { 'application/json': Pet } } };
  };
  '/document': { get: { responses: { 200: { content: { 'application/pdf': string } } } } };
  '/empty': { get: { responses: { 204: { content: never } } } };
};

// This function is compiled by tsc but never invoked: invalid calls must fail
// compilation, and every assertion checks exact inference rather than assignment.
function assertTypes(client: OpenApiHttpClient<Paths>, api: OpenApiResource<Paths>) {
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'json',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'json',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Pet>>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'json',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Pet>>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'blob',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Blob>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'blob',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Blob>>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'blob',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Blob>>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'arraybuffer',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<ArrayBuffer>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'arraybuffer',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<ArrayBuffer>>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'arraybuffer',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<ArrayBuffer>>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'text',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<string>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'text',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<string>>>();
  expectTypeOf(
    client.get('/pets/{id}', {
      params: { path: { id: 1 } },
      responseType: 'text',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<string>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Pet>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Pet>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Blob>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Blob>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Blob>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<ArrayBuffer>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<ArrayBuffer>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<ArrayBuffer>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<string>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<string>>>();
  expectTypeOf(
    client.post('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<string>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Pet>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Pet>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Blob>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Blob>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Blob>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<ArrayBuffer>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<ArrayBuffer>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<ArrayBuffer>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<string>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<string>>>();
  expectTypeOf(
    client.put('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<string>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Pet>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Pet>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Blob>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Blob>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Blob>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<ArrayBuffer>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<ArrayBuffer>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<ArrayBuffer>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<string>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<string>>>();
  expectTypeOf(
    client.patch('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<string>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Pet>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'json',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Pet>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<Blob>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<Blob>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'blob',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<Blob>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<ArrayBuffer>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<ArrayBuffer>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'arraybuffer',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<ArrayBuffer>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'body',
    }),
  ).toEqualTypeOf<Observable<string>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'response',
    }),
  ).toEqualTypeOf<Observable<HttpResponse<string>>>();
  expectTypeOf(
    client.delete('/pets/{id}', {
      params: { path: { id: 1 } },
      body: { id: 1, name: 'Fido' },
      responseType: 'text',
      observe: 'events',
    }),
  ).toEqualTypeOf<Observable<HttpEvent<string>>>();

  expectTypeOf(client.get('/pets/{id}')).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(client.get('/empty')).toEqualTypeOf<Observable<never>>();
  const options = { responseType: 'blob', observe: 'response' } as const;
  expectTypeOf(client.get('/document', options)).toEqualTypeOf<Observable<HttpResponse<Blob>>>();
  const typedOptions: OpenApiHttpRequestOptions<'text'> = { responseType: 'text' };
  expectTypeOf(client.get('/document', typedOptions)).toEqualTypeOf<Observable<string>>();
  const defaultOptions: OpenApiHttpRequestOptions = {};
  expectTypeOf(
    client.get('/pets/{id}', {
      ...defaultOptions,
      params: { path: { id: 1 } },
    }),
  ).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(client.get('/pets/{id}', undefined)).toEqualTypeOf<Observable<Pet>>();
  expectTypeOf(client.get<'/pets/{id}'>('/pets/{id}')).toEqualTypeOf<Observable<Pet>>();
  const blobOptions: OpenApiHttpRequestOptions<'blob', 'response'> = {
    responseType: 'blob',
    observe: 'response',
  };
  expectTypeOf(client.get('/document', blobOptions)).toEqualTypeOf<
    Observable<HttpResponse<Blob>>
  >();

  // @ts-expect-error Non-default modes require both runtime discriminants
  const missingModes: OpenApiHttpRequestOptions<'blob', 'response'> = {};
  // @ts-expect-error A blob decoder cannot be omitted even when observation defaults to body
  const missingFormat: OpenApiHttpRequestOptions<'blob'> = {};
  // @ts-expect-error Full response observation must be supplied even with JSON decoding
  const missingObserve: OpenApiHttpRequestOptions<'json', 'response'> = {};
  // @ts-expect-error Every member of a non-default response union requires a decoder
  const missingUnionFormat: OpenApiHttpRequestOptions<'blob' | 'text'> = {};
  // @ts-expect-error Every member of a non-default observation union requires observe
  const missingUnionObserve: OpenApiHttpRequestOptions<'json', 'response' | 'events'> = {};
  const optionalFormat: { responseType?: 'blob' } = {};
  // @ts-expect-error Optional blob decoding could fall back to JSON at runtime
  client.get('/document', optionalFormat);
  const optionalObserve: { responseType: 'blob'; observe?: 'response' } = { responseType: 'blob' };
  // @ts-expect-error Optional full response observation could fall back to the body
  client.get('/document', optionalObserve);
  // @ts-expect-error Explicit decoder generic cannot bypass runtime options
  client.get<'/document', 'blob'>('/document');
  // @ts-expect-error Explicit observation generic cannot bypass runtime options
  client.get<'/document', 'json', 'events'>('/document');
  // @ts-expect-error Explicit non-default generics cannot pass undefined options
  client.get<'/document', 'blob', 'response'>('/document', undefined);
  // @ts-expect-error Explicit non-default generics cannot pass empty options
  client.get<'/document', 'blob', 'response'>('/document', {});
  // @ts-expect-error POST must also supply its non-default response options
  client.post<'/pets/{id}', 'blob'>('/pets/{id}');
  // @ts-expect-error PUT must also supply its non-default response options
  client.put<'/pets/{id}', 'blob'>('/pets/{id}');
  // @ts-expect-error PATCH must also supply its non-default response options
  client.patch<'/pets/{id}', 'blob'>('/pets/{id}');
  // @ts-expect-error DELETE must also supply its non-default response options
  client.delete<'/pets/{id}', 'blob'>('/pets/{id}');
  expectTypeOf(api('/pets/{id}', () => ({ params: { path: { id: 1 } } }))).toEqualTypeOf<
    HttpResourceRef<Pet | undefined>
  >();
  expectTypeOf(api.blob('/document')).toEqualTypeOf<HttpResourceRef<Blob | undefined>>();
  expectTypeOf(api.text('/document')).toEqualTypeOf<HttpResourceRef<string | undefined>>();
  expectTypeOf(api.arrayBuffer('/document')).toEqualTypeOf<
    HttpResourceRef<ArrayBuffer | undefined>
  >();
  expectTypeOf(api.blob('/document', { defaultValue: new Blob() })).toEqualTypeOf<
    HttpResourceRef<Blob>
  >();
  expectTypeOf(
    api.text('/document', {
      parse: (value) => {
        expectTypeOf(value).toEqualTypeOf<string>();
        return value.length;
      },
      defaultValue: 0,
    }),
  ).toEqualTypeOf<HttpResourceRef<number>>();
  expectTypeOf(
    api.blob('/document', {
      parse: (value) => {
        expectTypeOf(value).toEqualTypeOf<Blob>();
        return value.size;
      },
    }),
  ).toEqualTypeOf<HttpResourceRef<number | undefined>>();
  expectTypeOf(
    api.arrayBuffer('/document', {
      parse: (value) => {
        expectTypeOf(value).toEqualTypeOf<ArrayBuffer>();
        return value.byteLength;
      },
    }),
  ).toEqualTypeOf<HttpResourceRef<number | undefined>>();
  expectTypeOf(
    api('/pets/{id}', () => ({ params: { path: { id: 1 } } }), {
      defaultValue: { id: 0, name: '' },
    }),
  ).toEqualTypeOf<HttpResourceRef<Pet>>();
  expectTypeOf(
    api.blob('/pets/{id}', () => ({ params: { path: { id: 1 } }, body: { id: 1, name: 'Fido' } }), {
      method: 'post',
      defaultValue: new Blob(),
    }),
  ).toEqualTypeOf<HttpResourceRef<Blob>>();
  expectTypeOf(api.text('/document', { method: 'get', defaultValue: '' })).toEqualTypeOf<
    HttpResourceRef<string>
  >();
  expectTypeOf(api.text('/document', { method: 'get' })).toEqualTypeOf<
    HttpResourceRef<string | undefined>
  >();
  // @ts-expect-error Unknown endpoint
  client.get('/missing', { responseType: 'blob' });
  // @ts-expect-error Unsupported method
  client.post('/document', { responseType: 'blob' });
  // @ts-expect-error Path parameters remain checked
  client.get('/pets/{id}', { params: { path: { id: 'wrong' } }, responseType: 'blob' });
  client.post('/pets/{id}', {
    params: { path: { id: 1 } },
    // @ts-expect-error Request bodies remain checked
    body: { wrong: true },
    responseType: 'blob',
  });
  // @ts-expect-error Unknown decoder
  client.get('/document', { responseType: 'binary' });
  // @ts-expect-error Unknown observation mode
  client.get('/document', { observe: 'headers' });
  // @ts-expect-error Resource requires path parameters
  api.blob('/pets/{id}');
  // @ts-expect-error Wrong parameter type
  api.blob('/pets/{id}', () => ({ params: { path: { id: 'wrong' } } }));
  // @ts-expect-error Unsupported resource method
  api.blob('/document', { method: 'post' });
  // @ts-expect-error Raw parser input is Blob
  api.blob('/document', { parse: (value: string) => value.length });
  // @ts-expect-error Default must match raw value without a parser
  api.blob('/document', { defaultValue: 'wrong' });
  // @ts-expect-error Default must match parser output
  api.text('/document', { parse: (value) => value.length, defaultValue: 'wrong' });
}
void assertTypes;

function assertBroadOptions(
  client: OpenApiHttpClient<Paths>,
  options: OpenApiHttpRequestOptions<OpenApiResponseType, OpenApiObserve>,
) {
  type Body = Pet | Blob | ArrayBuffer | string;
  expectTypeOf(
    client.get('/pets/{id}', {
      ...options,
      params: { path: { id: 1 } },
    }),
  ).toEqualTypeOf<Observable<Body | HttpResponse<Body> | HttpEvent<Body>>>();
}
void assertBroadOptions;

describe('response formats and observation', () => {
  let client: OpenApiHttpClient<Paths>;
  let testing: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    testing = TestBed.inject(HttpTestingController);
    client = TestBed.runInInjectionContext(() => new OpenApiHttpClient<Paths>({ baseUrl: '/api' }));
  });
  afterEach(() => testing.verify());

  const formats: OpenApiResponseType[] = ['json', 'blob', 'arraybuffer', 'text'];
  const observations: OpenApiObserve[] = ['body', 'response', 'events'];
  for (const method of ['get', 'post', 'put', 'patch', 'delete'] as const) {
    for (const responseType of formats)
      for (const observe of observations) {
        it(`${method} ${responseType} ${observe} preserves request and response`, () => {
          const pet = { id: 1, name: 'Fido' };
          const body =
            responseType === 'json'
              ? pet
              : responseType === 'blob'
                ? new Blob(['%PDF-1.4'], { type: 'application/pdf' })
                : responseType === 'arraybuffer'
                  ? new Uint8Array([37, 80, 68, 70]).buffer
                  : 'plain text';
          const context = new HttpContext().set(new HttpContextToken(() => false), true);
          const values: unknown[] = [];
          const options = {
            params: { path: { id: 1 }, query: { limit: 2 } },
            body: pet,
            responseType,
            observe,
            reportProgress: true,
            headers: new HttpHeaders({ 'X-Test': 'value' }),
            context,
            withCredentials: true,
          };
          let result: Observable<unknown>;
          switch (method) {
            case 'get':
              result = client.get('/pets/{id}', { ...options, body: undefined });
              break;
            case 'post':
              result = client.post('/pets/{id}', options);
              break;
            case 'put':
              result = client.put('/pets/{id}', options);
              break;
            case 'patch':
              result = client.patch('/pets/{id}', options);
              break;
            case 'delete':
              result = client.delete('/pets/{id}', options);
              break;
          }
          result.subscribe((value) => values.push(value));
          const request = testing.expectOne('/api/pets/1?limit=2');
          expect(request.request.method).toBe(method.toUpperCase());
          expect(request.request.responseType).toBe(responseType);
          expect(request.request.body).toEqual(method === 'get' ? null : pet);
          expect(request.request.context).toBe(context);
          expect(request.request.headers.get('X-Test')).toBe('value');
          expect(request.request.withCredentials).toBe(true);
          expect(request.request.reportProgress).toBe(true);
          request.event({ type: HttpEventType.DownloadProgress, loaded: 4, total: 8 });
          request.flush(body, {
            headers: { 'Content-Disposition': 'attachment; filename="test.pdf"' },
          });
          if (observe === 'body') expect(values).toEqual([body]);
          else {
            const response = values.at(-1) as HttpResponse<unknown>;
            expect(response.body).toEqual(body);
            expect(response.headers.get('Content-Disposition')).toContain('test.pdf');
            expect(response.status).toBe(200);
            if (observe === 'events')
              expect(values).toContainEqual({
                type: HttpEventType.DownloadProgress,
                loaded: 4,
                total: 8,
              });
            else expect(values).toHaveLength(1);
          }
        });
      }
  }

  it('keeps a binary error body as supplied by Angular', () => {
    const errorBody = new Blob(['failure']);
    let received: unknown;
    client.get('/document', { responseType: 'blob' }).subscribe({
      error: (error) => {
        received = error.error;
      },
    });
    testing.expectOne('/api/document').flush(errorBody, { status: 500, statusText: 'Failure' });
    expect(received).toBe(errorBody);
  });

  it('decodes the PDF schema as a blob without generator changes', () => {
    const pdf = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    let received: Blob | undefined;
    client.get('/document', { responseType: 'blob' }).subscribe((value) => {
      received = value;
    });
    testing.expectOne('/api/document').flush(pdf);
    expect(received).toBe(pdf);
  });
});

describe('raw resource constructors', async () => {
  let testing: HttpTestingController;
  let api: OpenApiResource<Paths>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    testing = TestBed.inject(HttpTestingController);
    api = TestBed.runInInjectionContext(() => createOpenApiResource<Paths>({ baseUrl: '/api' }));
  });
  afterEach(() => testing.verify());

  it('exposes blob headers, status and progress, and follows signals including idle and cancellation', async () => {
    const id = signal<number | undefined>(undefined);
    const resource = TestBed.runInInjectionContext(() =>
      api.blob('/pets/{id}', () => {
        const value = id();
        return value === undefined
          ? undefined
          : { params: { path: { id: value } }, reportProgress: true };
      }),
    );
    TestBed.tick();

    testing.expectNone('/api/pets/1');
    expect(resource.status()).toBe('idle');
    id.set(1);
    TestBed.tick();

    const first = testing.expectOne('/api/pets/1');
    expect(first.request.responseType).toBe('blob');
    id.set(2);
    TestBed.tick();

    expect(first.cancelled).toBe(true);
    const second = testing.expectOne('/api/pets/2');
    second.event({ type: HttpEventType.DownloadProgress, loaded: 4, total: 8 });
    TestBed.tick();

    expect(resource.progress()?.loaded).toBe(4);
    const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    second.flush(blob, { headers: { 'Content-Type': 'application/pdf' } });
    TestBed.tick();

    await expect.poll(() => resource.value()).toBe(blob);
    expect(resource.headers()?.get('Content-Type')).toBe('application/pdf');
    expect(resource.statusCode()).toBe(200);
    resource.reload();
    TestBed.tick();

    testing.expectOne('/api/pets/2').flush(blob);
    TestBed.tick();

    id.set(undefined);
    TestBed.tick();

    expect(resource.status()).toBe('idle');
  });

  it('parses text and retains a default until a response arrives', async () => {
    const resource = TestBed.runInInjectionContext(() =>
      api.text('/document', {
        parse: (value) => value.length,
        defaultValue: 0,
      }),
    );
    expect(resource.value()).toBe(0);
    TestBed.tick();

    const request = testing.expectOne('/api/document');
    expect(request.request.responseType).toBe('text');
    request.flush('hello');
    TestBed.tick();

    await expect.poll(() => resource.value()).toBe(5);
  });

  it('parses array buffers and exposes errors', async () => {
    const resource = TestBed.runInInjectionContext(() =>
      api.arrayBuffer('/document', {
        parse: (value) => value.byteLength,
      }),
    );
    TestBed.tick();

    const request = testing.expectOne('/api/document');
    expect(request.request.responseType).toBe('arraybuffer');
    request.flush(new Uint8Array([1, 2, 3]).buffer);
    TestBed.tick();

    await expect.poll(() => resource.value()).toBe(3);
    resource.reload();
    TestBed.tick();

    testing.expectOne('/api/document').flush(null, { status: 500, statusText: 'Failure' });
    TestBed.tick();

    await expect.poll(() => resource.error()).toBeDefined();
  });

  it('supports explicit methods with typed request bodies', async () => {
    const resource = TestBed.runInInjectionContext(() =>
      api.blob(
        '/pets/{id}',
        () => ({
          params: { path: { id: 1 } },
          body: { id: 1, name: 'Fido' },
        }),
        { method: 'post' },
      ),
    );
    TestBed.tick();

    const request = testing.expectOne('/api/pets/1');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ id: 1, name: 'Fido' });
    const blob = new Blob();
    request.flush(blob);
    TestBed.tick();

    await expect.poll(() => resource.value()).toBe(blob);
  });
});
