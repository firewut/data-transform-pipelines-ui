import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api/api.service';
import { Project } from './classes/project';
import { registerContentQuery } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'create_pipeline_dialog',
  templateUrl: './create_pipeline.component.html'
})
export class CreatePipelineDialog {
  project: Project;
  title: string;
  description: string;

  constructor(
    public dialogRef: MatDialogRef<CreatePipelineDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api_service: APIService,
  ) {
    this.project = data.project;
  }

  createPipeline() {
    this.api_service.postPipeline(
      this.project,
      this.title,
      this.description,
    ).subscribe(
      (_) => {
        this.closeDialog();
      }
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  displayedColumns: string[] = ['title', 'description', 'processors'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api_service: APIService,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.getProject(
      this.route.snapshot.paramMap.get('id')
    );
  }

  getProject(id: string) {
    this.api_service.getProject(id)
      .subscribe(
        (project: Project) => {
          this.project = new Project(project);
        }
      );
  }

  createPipelineDialog(): void {
    const dialogRef = this.dialog.open(
      CreatePipelineDialog,
      {
        data: { project: this.project }
      }
    )
  }
}
