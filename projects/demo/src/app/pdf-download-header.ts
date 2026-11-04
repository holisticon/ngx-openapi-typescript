import { HttpResponse, type HttpInterceptorFn } from '@angular/common/http';
import { map } from 'rxjs';

/** The demo's static server cannot configure an attachment filename per asset. */
export const pdfDownloadHeader: HttpInterceptorFn = (request, next) => {
  if (request.url !== '/demo.pdf') return next(request);
  return next(request).pipe(
    map((event) =>
      event instanceof HttpResponse
        ? event.clone({
            headers: event.headers.set('Content-Disposition', 'attachment; filename="demo.pdf"'),
          })
        : event,
    ),
  );
};
