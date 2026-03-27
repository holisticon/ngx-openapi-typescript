/*
 * Public API Surface of ngx-openapi-resource
 */

export { createOpenApiResource } from './lib/open-api-resource';
export type { OpenApiResourceConfig, OpenApiResourceFactory } from './lib/open-api-resource';

export { OpenApiHttpClient } from './lib/open-api-http-client';
export type { OpenApiHttpClientConfig } from './lib/open-api-http-client';

export type {
  PathRecord,
  PathParameters,
  QueryParameters,
  OperationParamsObject,
  OperationBody,
  OpenApiOperationRequest,
  OpenApiRequestOptions,
  PathsWithMethod,
  SuccessResponseJSON,
  RequestBodyJSON,
  HttpMethod,
} from './lib/types';
