import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateComponent } from './components/create/create.component';
import { QuickComponent } from './components/quick/quick.component';
import { CustomComponent } from './components/custom/custom.component';
import { TestComponent } from './components/test/test.component';
import { PublishComponent } from './components/publish/publish.component';
import { TemplateComponent } from './components/template/template.component';
import { StudyComponent } from './components/study/study.component';
import { DocumentComponent } from './components/document/document.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatStepperModule, MatFormFieldModule, MatCheckboxModule, MatOptionModule, MatSelectModule, MatButtonToggleModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { SynthesisTestComponent } from './components/test/synthesis-test/synthesis-test.component';
import { StoreAssetsComponent } from './components/template/store-assets/store-assets.component';
import { QuillModule } from 'ngx-quill';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { HttpClient } from '@angular/common/http';

fdescribe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,NavbarComponent,CreateComponent,QuickComponent,CustomComponent,
        TestComponent,PublishComponent,TemplateComponent,StudyComponent,DocumentComponent,LoginComponent,
        RegisterComponent,SynthesisTestComponent,StoreAssetsComponent
      ],
      imports: [AppRoutingModule, MatStepperModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatCheckboxModule,
      TagInputModule, MatOptionModule, MatSelectModule, QuillModule, CodemirrorModule, MatButtonToggleModule],
      providers: [{provide: HttpClient}]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Prototipo-Angular7'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Prototipo-Angular7');
  });
});
