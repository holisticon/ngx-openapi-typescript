/*
 * Public API Surface of ngx-openapi-typescript
 */

export { createOpenApiResource } from './lib/open-api-resource';
export type {
  OpenApiResource,
  OpenApiResourceCall,
  OpenApiResourceCallOptions,
  OpenApiResourceConfig,
} from './lib/open-api-resource';

export { OpenApiHttpClient } from './lib/open-api-http-client';
export type { OpenApiHttpClientConfig } from './lib/open-api-http-client';

export type {
  HasRequiredKeys,
  OpenApiHttpRequestOptions,
  OpenApiObserve,
  OpenApiObservedValue,
  OpenApiResponseBody,
  OpenApiResponseType,
  HttpMethod,
  OpenApiOperationRequest,
  OpenApiRequestOptions,
  OperationBody,
  OperationParamsObject,
  PathParameters,
  PathRecord,
  PathsWithMethod,
  QueryParameters,
  RequestBodyJSON,
  SuccessResponseJSON,
} from './lib/types';
