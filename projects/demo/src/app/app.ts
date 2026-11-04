import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { createOpenApiResource, OpenApiHttpClient } from 'ngx-openapi-typescript';
import { components, paths } from './api.types';
import { DownloadDemo } from './download-demo';

type Todo = components['schemas']['Todo'];
type NewTodo = components['schemas']['NewTodo'];

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, DownloadDemo],
  template: `
    <main>
      <h1>ngx-openapi-typescript Demo</h1>
      <app-download-demo />

      <section>
        <h2><code>createOpenApiResource</code> — Reactive GET</h2>

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
        <h2><code>createOpenApiResource</code> — Reactive POST</h2>
        <form (submit)="submitNewTodo($event)">
          <label for="todo-title">New todo title</label>
          <input
            id="todo-title"
            #titleInputEl
            type="text"
            [value]="titleInput()"
            (input)="titleInput.set(titleInputEl.value)"
            placeholder="Enter todo title"
            [disabled]="createTodoResult.isLoading()"
          />
          <button type="submit" [disabled]="!titleInput() || createTodoResult.isLoading()">
            {{ createTodoResult.isLoading() ? 'Creating…' : 'Create Todo' }}
          </button>
        </form>
        @if (createTodoResult.value(); as created) {
          <p>Created: [{{ created.id }}] {{ created.title }}</p>
        }
      </section>

      <section>
        <h2><code>OpenApiHttpClient</code> — Imperative GET</h2>
        <button (click)="loadTodo(1)">Load Todo #1</button>
        @if (singleTodo()) {
          <pre>{{ singleTodo() | json }}</pre>
        }
      </section>

      <section>
        <h2><code>OpenApiHttpClient</code> — Imperative PUT</h2>
        <button (click)="updateTodo(1)">Update Todo #1</button>
        @if (updatedTodo()) {
          <p>Updated: [{{ updatedTodo()!.id }}] {{ updatedTodo()!.title }}</p>
        }
      </section>

      <section>
        <h2><code>OpenApiHttpClient</code> — Imperative DELETE</h2>
        <button (click)="deleteTodo(1)" [disabled]="deleteStatus() === 'deleted'">
          Delete Todo #1
        </button>
        @if (deleteStatus()) {
          <p>{{ deleteStatus() }}</p>
        }
      </section>
    </main>
  `,
  styles: `
    :host {
      font-family: sans-serif;
      display: block;
      padding: 2rem;
    }
    h1 {
      color: #c3002f;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 0.25rem 0;
    }
    section {
      margin-bottom: 2rem;
    }
    form {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }
    label {
      font-weight: bold;
    }
    input {
      padding: 0.4rem 0.6rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      cursor: pointer;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #c3002f;
      color: #fff;
    }
    button:disabled {
      background: #ccc;
      cursor: default;
    }
    pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 4px;
    }
  `,
})
export class App {
  // ── createOpenApiResource factory ─────────────────────────────────────────
  private readonly api = createOpenApiResource<paths>({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  });

  /** Reactive resource: fetches the first 5 todos automatically */
  protected readonly todos = this.api('/todos', () => ({
    params: { query: { _limit: 5 } },
  }));

  // ── Reactive POST via createOpenApiResource ───────────────────────────────
  protected readonly titleInput = signal('');
  private readonly pendingNewTodo = signal<NewTodo | null>(null);

  protected readonly createTodoResult = this.api(
    '/todos',
    () => {
      const body = this.pendingNewTodo();
      return body ? { body } : undefined;
    },
    { method: 'post' },
  );

  protected submitNewTodo(event: Event): void {
    event.preventDefault();
    const title = this.titleInput().trim();
    if (!title) return;
    this.pendingNewTodo.set({ title, userId: 1 });
  }

  // ── OpenApiHttpClient ─────────────────────────────────────────────────────
  private readonly client = new OpenApiHttpClient<paths>({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  });

  protected readonly singleTodo = signal<Todo | null>(null);
  protected readonly updatedTodo = signal<Todo | null>(null);
  protected readonly deleteStatus = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.createTodoResult.value() !== undefined && this.pendingNewTodo() !== null) {
        this.pendingNewTodo.set(null);
        this.titleInput.set('');
        this.todos.reload();
      }
    });
  }

  protected loadTodo(id: number): void {
    this.client
      .get('/todos/{id}', { params: { path: { id } } })
      .subscribe((todo) => this.singleTodo.set(todo));
  }

  protected updateTodo(id: number): void {
    this.client
      .put('/todos/{id}', {
        params: { path: { id } },
        body: { title: 'Updated via HttpClient', userId: 1 },
      })
      .subscribe((todo) => this.updatedTodo.set(todo));
  }

  protected deleteTodo(id: number): void {
    this.client
      .delete('/todos/{id}', { params: { path: { id } } })
      .subscribe(() => this.deleteStatus.set(`Todo #${id} deleted`));
  }
}
