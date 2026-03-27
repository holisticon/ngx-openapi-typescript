import { HttpParams } from '@angular/common/http';

/** Builds a full URL by substituting path parameters into the path template */
export function buildUrl(
  baseUrl: string,
  path: string,
  pathParams?: Record<string, string | number | boolean>,
): string {
  let url = baseUrl + path;
  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }
  return url;
}

/** Converts a query parameter map to an `HttpParams` instance */
export function toHttpParams(
  query?: Record<
    string,
    string | number | boolean | ReadonlyArray<string | number | boolean> | null | undefined
  >,
): HttpParams | undefined {
  if (!query) return undefined;
  let params = new HttpParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        params = params.append(key, String(v));
      }
    } else {
      params = params.set(key, String(value));
    }
  }
  return params;
}
