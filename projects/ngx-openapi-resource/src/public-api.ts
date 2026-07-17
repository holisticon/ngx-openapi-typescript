/*
 * Public API Surface of ngx-openapi-resource
 */

export { createOpenApiResource } from './lib/open-api-resource';
export type {
  OpenApiResourceCallOptions, OpenApiResourceConfig,
  OpenApiResourceFactory
} from './lib/open-api-resource';

export { OpenApiHttpClient } from './lib/open-api-http-client';
export type { OpenApiHttpClientConfig } from './lib/open-api-http-client';

export type {
  HttpMethod, OpenApiOperationRequest,
  OpenApiRequestOptions, OperationBody, OperationParamsObject, PathParameters, PathRecord, PathsWithMethod, QueryParameters, RequestBodyJSON, SuccessResponseJSON
} from './lib/types';

