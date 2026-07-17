/*
 * Public API Surface of ngx-openapi-typescript
 */

export { createOpenApiResource } from './lib/open-api-resource';
export type {
  OpenApiResource, OpenApiResourceCallOptions, OpenApiResourceConfig
} from './lib/open-api-resource';

export { OpenApiHttpClient } from './lib/open-api-http-client';
export type { OpenApiHttpClientConfig } from './lib/open-api-http-client';

export type {
  HasRequiredKeys,
  HttpMethod, OpenApiOperationRequest,
  OpenApiRequestOptions, OperationBody, OperationParamsObject, PathParameters, PathRecord, PathsWithMethod, QueryParameters, RequestBodyJSON, SuccessResponseJSON
} from './lib/types';

