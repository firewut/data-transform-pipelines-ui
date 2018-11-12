import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AboutComponent } from './projects/about.component';
import { ProcessorsComponent } from './projects/processors.component';
import { ProcessorComponent } from './projects/processor.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './projects/project.component';
import { PipelineComponent } from './projects/pipeline.component';
import { WelcomeComponent } from './projects/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'processors', component: ProcessorsComponent },
  { path: 'processors/:id', component: ProcessorComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:id', component: ProjectComponent },
  { path: 'pipelines/:id', component: PipelineComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
