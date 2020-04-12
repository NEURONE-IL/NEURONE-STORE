import { PublishComponent } from "./publish.component";
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { PublishesService } from 'src/app/services/publishes.service';
import { StudyService } from 'src/app/services/study.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { QuestionsService } from 'src/app/services/questions.service';
import { QuestionnairesService } from 'src/app/services/questionnaires.service';
import { StagesService } from 'src/app/services/stages.service';
import { DocumentsService } from 'src/app/services/documents.service';


    
const study = {
    "_id": "5deecd491bd2dd27d05218ce",
    "stages":["5d6891b8807ab32938d8d2ff", "5d674e2f8757431bb0bfa6f1","5d67282edf391f0ec4da3b33","5de1ddea142e223c48a4b2ea","5d673037df391f0ec4da3b34"],
    "tags":[],
    "id":"New Study Title",
    "locale":{"_id":"5d806e9a933bce352041cf6a","name":"Español","alias":"ES","code":"es-ES","user":"5d531f2f7ec31122f5982cf4"},
    "domain":{"_id":"5d687dda807ab32938d8d2fc","name":"Social","alias":"social","code":"SS","description":"","user":"5d531f2f7ec31122f5982cf4"},
    "task":{"_id":"5d687de3807ab32938d8d2fd","name":"Email","alias":"email","code":"E","description":"","user":"5d531f2f7ec31122f5982cf4"},
    "maxGlobalTime":-1,
    "minBookmarks":3,
    "maxBookmarks":3,
    "minSnippetsPerPage":2,
    "maxSnippetsPerPage":2,
    "minSnippetWordLength":5,
    "maxSnippetWordLength":20,
    "snippetWordTruncateThreshold":20,
    "minSynthesisWordLength":50,
    "minSynthesisCharLength":425,
    "syhtesisAutosaveInterval":30,
    "taskPage":"modal-hello.html",
    "replaceWithRelevantDocuments":false,
    "avatar":"Bastian",
    "user":"5d531f2f7ec31122f5982cf4",
    "public":false,
    "maxStars":3
}

fdescribe('PublishComponent', () => {
    let component: PublishComponent;
    let fixture: ComponentFixture<PublishComponent>;
    let publishesService = jasmine.createSpyObj('PublishesService', ['getMyPublishes']);
    let studyService = jasmine.createSpyObj('StudyService', ['getMyStudies']);
    let authService = jasmine.createSpyObj('AuthService', ['getUser']);
    let questionsService = jasmine.createSpyObj('QuestionsService', ['getQuestion']);
    let testService = jasmine.createSpyObj('QuestionnairesService', ['getQuestionnaire']);
    let stageService = jasmine.createSpyObj('StagesService', ['getStage']);
    let docService = jasmine.createSpyObj('DocumentsService', ['getMyDocs']);
    let getMyPublishesSpy = publishesService.getMyPublishes.and.returnValue( of( [] ));
    let getMyStudiesSpy = studyService.getMyStudies.and.returnValue( of( [] ) );
    let authServiceSpy = authService.getUser.and.returnValue( of( {'user': 'test'} ) );
    let questionsServiceSpy = questionsService.getQuestion.and.returnValue( of({}) );
    let testServiceSpy = testService.getQuestionnaire.and.returnValue( of({}) );
    let stageServiceSpy = stageService.getStage.and.returnValue( of(null) );
    let docServiceSpy = docService.getMyDocs.and.returnValue( of(null) );

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ PublishComponent ],
          imports: [RouterModule.forRoot([]), MatDialogModule, HttpClientModule],
          providers: [{ provide: PublishesService, useValue: publishesService }, { provide: StudyService, useValue: studyService }, 
        { provide: AuthService, useValue: authService }, { provide: QuestionsService, useValue: questionsService},
        { provide: QuestionnairesService, useValue: testService }, { provide: StagesService, useValue: stageService},
        { provide: DocumentsService, useValue: docService}]
        })
        .compileComponents();
        }));
    
        beforeEach(() => {
            fixture = TestBed.createComponent(PublishComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should get test user name', fakeAsync(() => {
            component.myPublishes = [];
            component.myStudies = [];
            component.activeStudy = {user: 'test'};
            fixture.detectChanges();
            component.getUserInfo();

            tick();

            fixture.detectChanges();
            expect(component.publish.owner).toBe("test");
        }));

        it('should test questions and questionnaires', fakeAsync(() => {
            component.activeStudy = study;
            fixture.detectChanges();
            component.generatePublish();

            tick(500);

            fixture.detectChanges();
            expect(component.totalItems).toBeGreaterThan(component.loadedItems);
        }));
});