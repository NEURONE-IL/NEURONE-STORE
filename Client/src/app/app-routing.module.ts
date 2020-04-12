import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './components/create/create.component';
import { QuickComponent } from './components/quick/quick.component';
import { CustomComponent } from './components/custom/custom.component';
import { TestComponent } from './components/test/test.component';
import { TemplateComponent } from './components/template/template.component';
import { DocumentComponent } from './components/document/document.component';
import { StudyComponent } from './components/study/study.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { PublishComponent } from './components/publish/publish.component';



const routes: Routes = [
  {path: 'create', component: CreateComponent, canActivate:[AuthGuard]},
  {path: 'quick', component: QuickComponent, canActivate:[AuthGuard]},
  {path: 'custom', component: CustomComponent, canActivate:[AuthGuard]},
  {path: 'test', component: TestComponent, canActivate:[AuthGuard]},
  {path: 'template', component: TemplateComponent, canActivate:[AuthGuard]},
  {path: 'document', component: DocumentComponent, canActivate:[AuthGuard]},
  {path: 'study', component: StudyComponent, canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'publish', component: PublishComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'create'}
]

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }