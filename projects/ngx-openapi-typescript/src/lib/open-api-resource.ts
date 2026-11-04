import {
  HttpContext,
  HttpHeaders,
  type HttpResourceOptions,
  type HttpResourceRef,
  httpResource,
} from '@angular/common/http';
import type { PathsWithMethod } from 'openapi-typescript-helpers';
import type {
  HasRequiredKeys,
  HttpMethod,
  OpenApiOperationRequest,
  OpenApiResponseBody,
  OpenApiResponseType,
  PathRecord,
} from './types';
import { buildUrl, toHttpParams } from './url-utils';

export { buildUrl, toHttpParams } from './url-utils';

/** Configuration for creating an OpenAPI resource factory */
export interface OpenApiResourceConfig {
  /** Base URL to prepend to all resource paths */
  baseUrl?: string;
}

/**
 * Options for the resource call, extending Angular's `HttpResourceOptions` with an
 * optional HTTP method. `TRaw` is the decoded input type received by `parse`.
 */
export type OpenApiResourceCallOptions<TValue, TRaw = unknown> = HttpResourceOptions<
  TValue,
  TRaw
> & { method?: HttpMethod };

/** Extracts the operation type for a given path and method */
type OpOf<Paths, Path extends keyof Paths, Method extends string> = Paths[Path] extends {
  [K in Method]: infer Op;
}
  ? NonNullable<Op>
  : never;

/** Extract which HTTP methods a given path supports */
type MethodsOfPath<Paths, Path extends keyof Paths> = {
  [M in HttpMethod]: Paths[Path] extends { [K in M]: unknown } ? M : never;
}[HttpMethod];

/**
 * Narrows to paths whose operation has no required parameters or body,
 * allowing the request callback to be omitted.
 */
type PathsWithOptionalRequest<Paths extends PathRecord, Method extends HttpMethod> = {
  [P in PathsWithMethod<Paths, Method> & keyof Paths]: HasRequiredKeys<
    OpenApiOperationRequest<OpOf<Paths, P, Method>>
  > extends true
  ? never
  : P;
}[PathsWithMethod<Paths, Method> & keyof Paths];

type RawOf<Format extends OpenApiResponseType> = Format extends 'json'
  ? unknown
  : OpenApiResponseBody<never, Format>;

/**
 * Callable resource constructor with generated endpoint and request types.
 * Defaults to the decoded response type; `parse` infers a transformed result.
 * A defined `defaultValue` removes the implicit `undefined` from the value type.
 */
export interface OpenApiResourceCall<
  Paths extends PathRecord,
  Format extends OpenApiResponseType = 'json',
> {
  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   * Infers the result type from `parse`.
   * Uses the supplied default value while idle or loading.
   */
  <Path extends keyof Paths & string, Method extends MethodsOfPath<Paths, Path>, TResult>(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, Method>> | undefined,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    } & { method: Method } & { defaultValue: NoInfer<TResult> },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   * Uses the supplied default value while idle or loading.
   */
  <
    Path extends keyof Paths & string,
    Method extends MethodsOfPath<Paths, Path>,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, Method>, Format>,
  >(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, Method>> | undefined,
    options: HttpResourceOptions<TResult, RawOf<Format>> & { method: Method } & {
      defaultValue: NoInfer<TResult>;
    },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   * Infers the result type from `parse`.
   */
  <Path extends keyof Paths & string, Method extends MethodsOfPath<Paths, Path>, TResult>(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, Method>> | undefined,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    } & { method: Method },
  ): HttpResourceRef<TResult | undefined>;

  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   */
  <
    Path extends keyof Paths & string,
    Method extends MethodsOfPath<Paths, Path>,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, Method>, Format>,
  >(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, Method>> | undefined,
    options: HttpResourceOptions<TResult, RawOf<Format>> & { method: Method },
  ): HttpResourceRef<TResult | undefined>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   * Infers the result type from `parse`.
   * Uses the supplied default value while idle or loading.
   */
  <Path extends PathsWithMethod<Paths, 'get'> & keyof Paths, TResult>(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, 'get'>> | undefined,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    } & { defaultValue: NoInfer<TResult> },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   * Uses the supplied default value while idle or loading.
   */
  <
    Path extends PathsWithMethod<Paths, 'get'> & keyof Paths,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, 'get'>, Format>,
  >(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, 'get'>> | undefined,
    options: HttpResourceOptions<TResult, RawOf<Format>> & { defaultValue: NoInfer<TResult> },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   * Infers the result type from `parse`.
   */
  <Path extends PathsWithMethod<Paths, 'get'> & keyof Paths, TResult>(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, 'get'>> | undefined,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    },
  ): HttpResourceRef<TResult | undefined>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Re-fetches when signals read in `requestFn` change; `undefined` makes the resource idle.
   */
  <
    Path extends PathsWithMethod<Paths, 'get'> & keyof Paths,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, 'get'>, Format>,
  >(
    path: Path,
    requestFn: () => OpenApiOperationRequest<OpOf<Paths, Path, 'get'>> | undefined,
    options?: HttpResourceOptions<TResult, RawOf<Format>>,
  ): HttpResourceRef<TResult | undefined>;

  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   * Infers the result type from `parse`.
   * Uses the supplied default value while idle or loading.
   */
  <Path extends keyof Paths & string, Method extends MethodsOfPath<Paths, Path>, TResult>(
    path: Path extends PathsWithOptionalRequest<Paths, Method> ? Path : never,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    } & { method: Method } & { defaultValue: NoInfer<TResult> },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   * Uses the supplied default value while idle or loading.
   */
  <
    Path extends keyof Paths & string,
    Method extends MethodsOfPath<Paths, Path>,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, Method>, Format>,
  >(
    path: Path extends PathsWithOptionalRequest<Paths, Method> ? Path : never,
    options: HttpResourceOptions<TResult, RawOf<Format>> & { method: Method } & {
      defaultValue: NoInfer<TResult>;
    },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   * Infers the result type from `parse`.
   */
  <Path extends keyof Paths & string, Method extends MethodsOfPath<Paths, Path>, TResult>(
    path: Path extends PathsWithOptionalRequest<Paths, Method> ? Path : never,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    } & { method: Method },
  ): HttpResourceRef<TResult | undefined>;

  /**
   * Creates a reactive resource with an explicit method supported by the endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   */
  <
    Path extends keyof Paths & string,
    Method extends MethodsOfPath<Paths, Path>,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, Method>, Format>,
  >(
    path: Path extends PathsWithOptionalRequest<Paths, Method> ? Path : never,
    options: HttpResourceOptions<TResult, RawOf<Format>> & { method: Method },
  ): HttpResourceRef<TResult | undefined>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   * Infers the result type from `parse`.
   * Uses the supplied default value while idle or loading.
   */
  <Path extends PathsWithOptionalRequest<Paths, 'get'>, TResult>(
    path: Path,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    } & { defaultValue: NoInfer<TResult> },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   * Uses the supplied default value while idle or loading.
   */
  <
    Path extends PathsWithOptionalRequest<Paths, 'get'>,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, 'get'>, Format>,
  >(
    path: Path,
    options: HttpResourceOptions<TResult, RawOf<Format>> & { defaultValue: NoInfer<TResult> },
  ): HttpResourceRef<TResult>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   * Infers the result type from `parse`.
   */
  <Path extends PathsWithOptionalRequest<Paths, 'get'>, TResult>(
    path: Path,
    options: HttpResourceOptions<TResult, RawOf<Format>> & {
      parse: (value: RawOf<Format>) => TResult;
    },
  ): HttpResourceRef<TResult | undefined>;

  /**
   * Creates a reactive GET resource for an OpenAPI endpoint.
   * Only available when the operation has no required parameters or body; fetches immediately.
   */
  <
    Path extends PathsWithOptionalRequest<Paths, 'get'>,
    TResult = OpenApiResponseBody<OpOf<Paths, Path, 'get'>, Format>,
  >(
    path: Path,
    options?: HttpResourceOptions<TResult, RawOf<Format>>,
  ): HttpResourceRef<TResult | undefined>;
}

/** The callable JSON factory returned by `createOpenApiResource`, with raw response variants. */
export interface OpenApiResource<Paths extends PathRecord> extends OpenApiResourceCall<Paths> {
  /** Creates a resource that decodes the response as a `Blob`. */
  blob: OpenApiResourceCall<Paths, 'blob'>;
  /** Creates a resource that decodes the response as a `string`. */
  text: OpenApiResourceCall<Paths, 'text'>;
  /** Creates a resource that decodes the response as an `ArrayBuffer`. */
  arrayBuffer: OpenApiResourceCall<Paths, 'arraybuffer'>;
}

type RequestShape = {
  params?: {
    path?: Record<string, string | number | boolean>;
    query?: Record<string, string | number | boolean | null | undefined>;
  };
  body?: unknown;
  headers?: HttpHeaders | Record<string, string | ReadonlyArray<string>>;
  context?: HttpContext;
  withCredentials?: boolean;
  reportProgress?: boolean;
};

/**
 * Creates a type-safe callable factory for Angular `httpResource`s backed by an OpenAPI schema.
 *
 * Must be called inside an Angular injection context (e.g. component/service
 * field initializer or constructor), because the returned function uses `httpResource` internally.
 *
 * The returned function defaults to JSON GET. Use `.blob()`, `.text()` or `.arrayBuffer()`
 * to select raw response decoding. Request callbacks re-run when their signal dependencies
 * change; returning `undefined` puts the resource into the Idle state without making a request.
 *
 * Pass `{ method: 'post' }` (or another supported method) in the options to override GET.
 * Angular recommends using `httpResource` for reads; prefer `OpenApiHttpClient` for mutations.
 *
 * @example
 * ```ts
 * import type { paths } from './api.types'; // generated by openapi-typescript
 *
 * const api = createOpenApiResource<paths>({ baseUrl: 'https://api.example.com' });
 *
 * // Reactive GET resource (default)
 * const pets = api('/pets', () => ({ params: { query: { limit: 10 } } }));
 *
 * // GET with signal-driven path parameters
 * const petId = signal(1);
 * const pet = api('/pets/{petId}', () => ({ params: { path: { petId: petId() } } }));
 *
 * // Explicit method override (prefer OpenApiHttpClient for mutations)
 * const created = api('/pets', () => ({ body: { name: 'Buddy' } }), { method: 'post' });
 * ```
 *
 * @example
 * ```ts
 * const pdf = api.blob('/documents/{id}', () => ({
 *   params: { path: { id: documentId() } },
 * })); // HttpResourceRef<Blob | undefined>
 *
 * const length = api.text('/export', {
 *   parse: text => text.length,
 *   defaultValue: 0,
 * }); // HttpResourceRef<number>
 * ```
 */
export function createOpenApiResource<Paths extends PathRecord>(
  config?: OpenApiResourceConfig,
): OpenApiResource<Paths> {
  const baseUrl = config?.baseUrl ?? '';

  function constructorFor<Format extends OpenApiResponseType>(
    format: Format,
  ): OpenApiResourceCall<Paths, Format> {
    const create = (
      path: string,
      reqFnOrOpts?: (() => unknown) | OpenApiResourceCallOptions<unknown>,
      maybeOpts?: OpenApiResourceCallOptions<unknown>,
    ) => {
      const requestFn = typeof reqFnOrOpts === 'function' ? reqFnOrOpts : () => ({});
      const options = typeof reqFnOrOpts === 'function' ? maybeOpts : reqFnOrOpts;
      const { method = 'get', ...resourceOptions } = options ?? {};
      const request = () => {
        const value = requestFn();
        if (value === undefined) return undefined;
        const r = value as RequestShape;
        return {
          url: buildUrl(baseUrl, path, r.params?.path),
          method: method.toUpperCase(),
          body: r.body,
          params: toHttpParams(r.params?.query),
          headers: r.headers,
          context: r.context,
          withCredentials: r.withCredentials,
          reportProgress: r.reportProgress,
        };
      };

      switch (format) {
        case 'blob':
          return httpResource.blob(request, resourceOptions);
        case 'text':
          return httpResource.text(request, resourceOptions);
        case 'arraybuffer':
          return httpResource.arrayBuffer(request, resourceOptions);
        default:
          return httpResource(request, resourceOptions);
      }
    };
    // The overloads associate each endpoint and decoder with its options/result.
    return create as OpenApiResourceCall<Paths, Format>;
  }

  return Object.assign(constructorFor('json'), {
    blob: constructorFor('blob'),
    text: constructorFor('text'),
    arrayBuffer: constructorFor('arraybuffer'),
  });
}
