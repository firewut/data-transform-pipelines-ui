import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { DragulaModule } from 'ng2-dragula';
import { HighlightModule } from 'ngx-highlightjs';
import { MaterialDesignFrameworkModule } from 'angular6-json-schema-form';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

@NgModule({
  exports: [
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
})
export class MaterialModule { }

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { APIService } from './services/api/api.service';
import { AboutComponent } from './projects/about.component';
import { ProcessorsComponent } from './projects/processors.component';
import { ProcessorComponent } from './projects/processor.component';
import { ProjectsComponent, CreateProjectDialog } from './projects/projects.component';
import { ProjectComponent, CreatePipelineDialog } from './projects/project.component';
import { PipelineComponent } from './projects/pipeline.component';
import { WelcomeComponent } from './projects/welcome.component';

@NgModule({
  entryComponents: [
    CreateProjectDialog,
    CreatePipelineDialog,
  ],
  declarations: [
    WelcomeComponent,
    AppComponent,
    AboutComponent,
    ProcessorsComponent,
    ProcessorComponent,
    ProjectsComponent,
    CreateProjectDialog,
    CreatePipelineDialog,
    ProjectComponent,
    PipelineComponent,
  ],
  imports: [
    MaterialDesignFrameworkModule,
    DragulaModule.forRoot(),
    NgSelectModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    FileUploadModule,
    HighlightModule.forRoot({
      theme: 'default'
    }),
  ],
  providers: [
    APIService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
