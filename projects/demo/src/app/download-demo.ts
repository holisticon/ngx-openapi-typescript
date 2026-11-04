import { HttpEventType } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { createOpenApiResource, OpenApiHttpClient } from 'ngx-openapi-typescript';
import type { paths } from './api.types';

@Component({
  selector: 'app-download-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="download-title">
      <h2 id="download-title">PDF downloads</h2>
      <p>These examples use a local PDF and work independently of JSONPlaceholder.</p>

      <h3>HTTP client: full response and filename</h3>
      <button type="button" (click)="prepareDownload()" [disabled]="loading()">
        {{ loading() ? 'Preparing PDF…' : 'Prepare PDF download' }}
      </button>
      <p role="status">{{ message() }}</p>
      @if (downloadUrl(); as url) {
        <a [href]="url" [download]="filename()">Download {{ filename() }}</a>
      }

      <h3>Reactive blob resource</h3>
      <button type="button" (click)="pdf.reload()" [disabled]="pdf.isLoading()">Reload PDF</button>
      <div role="status">
        @if (pdf.isLoading()) {
          <p>Loading PDF…</p>
        } @else if (pdf.error()) {
          <p>Could not load the PDF. Use Reload PDF to try again.</p>
        } @else if (resourceUrl(); as url) {
          <p>PDF ready ({{ pdf.value()?.size }} bytes).</p>
          <a [href]="url" download="resource-demo.pdf">Download resource PDF</a>
        }
      </div>

      <h3>HTTP client: download events</h3>
      <button type="button" (click)="loadWithProgress()" [disabled]="progressLoading()">
        Read PDF with progress
      </button>
      <p role="status">{{ progressMessage() }}</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
      margin-block: 2rem;
    }
    button,
    a {
      font: inherit;
    }
    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    a {
      color: #8b0021;
      text-underline-offset: 0.2em;
    }
    :is(button, a):focus-visible {
      outline: 3px solid #005fcc;
      outline-offset: 3px;
    }
  `,
})
export class DownloadDemo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly client = new OpenApiHttpClient<paths>();
  private readonly api = createOpenApiResource<paths>();
  private readonly downloadedBlob = signal<Blob | undefined>(undefined);

  protected readonly pdf = this.api.blob('/demo.pdf', () => ({ reportProgress: true }));
  protected readonly loading = signal(false);
  protected readonly message = signal('Prepare a PDF to create a download link.');
  protected readonly filename = signal('demo.pdf');
  protected readonly downloadUrl = signal<string | undefined>(undefined);
  protected readonly resourceUrl = signal<string | undefined>(undefined);
  protected readonly progressLoading = signal(false);
  protected readonly progressMessage = signal('Progress is reported when the browser provides it.');

  constructor() {
    effect((onCleanup) => {
      const blob = this.downloadedBlob();
      const url = blob ? URL.createObjectURL(blob) : undefined;
      this.downloadUrl.set(url);
      onCleanup(() => {
        if (url) URL.revokeObjectURL(url);
      });
    });
    effect((onCleanup) => {
      const blob = this.pdf.hasValue() ? this.pdf.value() : undefined;
      const url = blob ? URL.createObjectURL(blob) : undefined;
      this.resourceUrl.set(url);
      onCleanup(() => {
        if (url) URL.revokeObjectURL(url);
      });
    });
  }

  protected prepareDownload(): void {
    this.loading.set(true);
    this.downloadedBlob.set(undefined);
    this.message.set('Preparing PDF…');
    this.client
      .get('/demo.pdf', { responseType: 'blob', observe: 'response' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          if (!response.body) {
            this.message.set('The server returned an empty response. Try again.');
            return;
          }
          // This demo server supplies a simple quoted ASCII filename.
          const filename = /filename="([^"/\\]+)"/i.exec(
            response.headers.get('Content-Disposition') ?? '',
          )?.[1];
          this.filename.set(filename ?? 'demo.pdf');
          this.downloadedBlob.set(response.body);
          this.message.set('PDF ready. Follow the download link.');
        },
        error: () => {
          this.loading.set(false);
          this.message.set('Could not prepare the PDF. Try again.');
        },
      });
  }

  protected loadWithProgress(): void {
    this.progressLoading.set(true);
    this.progressMessage.set('Reading PDF…');
    this.client
      .get('/demo.pdf', { responseType: 'blob', observe: 'events', reportProgress: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.progressMessage.set(`Received ${event.loaded} bytes.`);
          } else if (event.type === HttpEventType.Response) {
            this.progressLoading.set(false);
            this.progressMessage.set(`PDF received (${event.body?.size ?? 0} bytes).`);
          }
        },
        error: () => {
          this.progressLoading.set(false);
          this.progressMessage.set('Could not read the PDF. Try again.');
        },
      });
  }
}
