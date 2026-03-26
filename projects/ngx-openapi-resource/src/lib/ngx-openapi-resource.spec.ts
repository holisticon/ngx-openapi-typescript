import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOpenapiResource } from './ngx-openapi-resource';

describe('NgxOpenapiResource', () => {
  let component: NgxOpenapiResource;
  let fixture: ComponentFixture<NgxOpenapiResource>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOpenapiResource],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxOpenapiResource);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
