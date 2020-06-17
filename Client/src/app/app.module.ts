import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//services
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';

//npm packages
import { MatStepperModule, MatButtonModule, MatFormFieldModule, MatInputModule, 
  MatDialogModule, MatSelectModule, MatOptionModule, MatProgressBarModule, MatListModule, MatCheckboxModule,
  MatButtonToggleModule} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';

//project components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CreateComponent } from './components/create/create.component';
import { AppRoutingModule } from './app-routing.module';
import { QuickComponent } from './components/quick/quick.component';
import { CustomComponent } from './components/custom/custom.component';
import { TestComponent } from './components/test/test.component';
import { TitleEditComponent } from './components/test/title-edit.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TemplateComponent } from './components/template/template.component';
import { DocumentComponent } from './components/document/document.component';
import { StudyComponent } from './components/study/study.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NewQuestionComponent } from './components/new-question/new-question.component';
import { NewAssetComponent } from './components/document/new-asset/new-asset.component';
import { EditAssetComponent } from './components/document/edit-asset/edit-asset.component';
import { UploadComponent } from './components/template/upload/upload.component';
import { ExampleComponent } from './components/template/example/example.component';
import { AffectiveComponent } from './components/study/affective/affective.component';
import { CollectionComponent } from './components/study/collection/collection.component';
import { CriticalEvalComponent } from './components/study/critical-eval/critical-eval.component';
import { EndComponent } from './components/study/end/end.component';
import { InstructionsComponent } from './components/study/instructions/instructions.component';
import { SearchComponent } from './components/study/search/search.component';
import { SynthesisComponent } from './components/study/synthesis/synthesis.component';
import { TutorialComponent } from './components/study/tutorial/tutorial.component';
import { TaskQuestionsComponent } from './components/study/task-questions/task-questions.component';
import { SynthesisTestComponent } from './components/test/synthesis-test/synthesis-test.component';
import { TestDetailComponent } from './components/test/test-detail/test-detail.component';
import { AddTestStoreComponent } from './components/test/add-test-store/add-test-store.component';
import { StudyDetailComponent } from './components/study/study-detail/study-detail.component';
import { AddStudyStoreComponent } from './components/study/add-study-store/add-study-store.component';
import { CreatedStagesComponent } from './components/quick/created-stages/created-stages.component';
import { StoreAssetsComponent } from './components/template/store-assets/store-assets.component';
import { PreviewAssetComponent } from './components/template/preview-asset/preview-asset.component';
import { PreviewComponent } from './components/document/preview/preview.component';
import { PublishComponent } from './components/publish/publish.component';
import { CreatedQuestionsComponent } from './components/test/created-questions/created-questions.component';
import { TestStoreComponent } from './components/test/test-store/test-store.component';
import { NewStageComponent } from './components/study/new-stage/new-stage.component';
import { ListStudyStoreComponent } from './components/study/list-study-store/list-study-store.component';
import { SimpleEditorComponent } from './components/template/simple-editor/simple-editor.component';

@NgModule({
  entryComponents: [
    TitleEditComponent,
    ConfirmationDialogComponent,
    NewQuestionComponent,
    NewAssetComponent,
    EditAssetComponent,
    UploadComponent,
    ExampleComponent,
    AffectiveComponent,
    CollectionComponent,
    CriticalEvalComponent,
    EndComponent,
    SynthesisComponent,
    TutorialComponent,
    TaskQuestionsComponent,
    InstructionsComponent,
    SearchComponent,
    TestDetailComponent,
    AddTestStoreComponent,
    StudyDetailComponent,
    AddStudyStoreComponent,
    CreatedStagesComponent,
    PreviewAssetComponent,
    PreviewComponent,
    CreatedQuestionsComponent,
    TestStoreComponent,
    NewStageComponent,
    ListStudyStoreComponent,
    SimpleEditorComponent
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    CreateComponent,
    QuickComponent,
    CustomComponent,
    TestComponent,
    TitleEditComponent,
    ConfirmationDialogComponent,
    TemplateComponent,
    DocumentComponent,
    StudyComponent,
    LoginComponent,
    RegisterComponent,
    NewQuestionComponent,
    NewAssetComponent,
    EditAssetComponent,
    UploadComponent,
    ExampleComponent,
    AffectiveComponent,
    CollectionComponent,
    CriticalEvalComponent,
    EndComponent,
    InstructionsComponent,
    SearchComponent,
    SynthesisComponent,
    TutorialComponent,
    TaskQuestionsComponent,
    SynthesisTestComponent,
    TestDetailComponent,
    AddTestStoreComponent,
    StudyDetailComponent,
    AddStudyStoreComponent,
    CreatedStagesComponent,
    StoreAssetsComponent,
    PreviewAssetComponent,
    PreviewComponent,
    PublishComponent,
    CreatedQuestionsComponent,
    TestStoreComponent,
    NewStageComponent,
    ListStudyStoreComponent,
    SimpleEditorComponent
  ],
  imports: [
    HttpClientModule, BrowserModule, AppRoutingModule, MatStepperModule, MatButtonModule, MatInputModule,
    MatFormFieldModule,MatProgressBarModule,MatListModule,BrowserAnimationsModule,
    FormsModule,ReactiveFormsModule,NgbModalModule,MatDialogModule, DragDropModule,
    MatSelectModule, MatOptionModule,CodemirrorModule,QuillModule,TagInputModule,
    MatCheckboxModule,MatButtonToggleModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
