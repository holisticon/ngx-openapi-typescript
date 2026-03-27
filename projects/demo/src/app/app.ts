import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { createOpenApiResource, OpenApiHttpClient } from 'ngx-openapi-resource';
import { components, paths } from './api.types';

type Todo = components['schemas']['Todo'];

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
  template: `
    <h1>ngx-openapi-resource Demo</h1>

    <section>
      <h2>
        <code>createOpenApiResource</code> — Reactive GET resource
      </h2>

      @if (todos.isLoading()) {
        <p>Loading todos…</p>
      } @else if (todos.error()) {
        <p>Error: {{ todos.error() }}</p>
      } @else {
        <ul>
          @for (todo of todos.value(); track todo.id) {
            <li [style.text-decoration]="todo.completed ? 'line-through' : 'none'">
              [{{ todo.id }}] {{ todo.title }}
            </li>
          }
        </ul>
      }
    </section>

    <section>
      <h2>
        <code>OpenApiHttpClient</code> — Imperative fetch
      </h2>
      <button (click)="loadTodo()">Load Todo #1 via OpenApiHttpClient</button>
      @if (singleTodo()) {
        <pre>{{ singleTodo() | json }}</pre>
      }
    </section>
  `,
  styles: `
    :host {
      font-family: sans-serif;
      display: block;
      padding: 2rem;
    }
    h1 { color: #c3002f; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.25rem 0; }
    button { cursor: pointer; padding: 0.5rem 1rem; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; }
  `,
})
export class App {
  // ── createOpenApiResource example ──────────────────────────────────────────
  private readonly api = createOpenApiResource<paths>({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  });

  /** Reactive resource: fetches the first 5 todos automatically */
  protected readonly todos = this.api.get('/todos', () => ({
    query: { _limit: 5 },
  }));

  // ── OpenApiHttpClient example ───────────────────────────────────────────────
  private readonly client = new OpenApiHttpClient<paths>({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  });

  protected readonly singleTodo = signal<Todo | null>(null);

  protected loadTodo(): void {
    this.client.get('/todos/{id}', { path: { id: 1 } }).subscribe((todo) => {
      this.singleTodo.set(todo);
    });
  }
}
