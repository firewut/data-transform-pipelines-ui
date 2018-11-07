import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { APIService } from '../services/api/api.service';
import { PaginatedDataSource } from '../services/api/data_sources/paginated_response';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'create_project_dialog',
  templateUrl: './create_project.component.html'
})
export class CreateProjectDialog {
  title: string;
  description: string;

  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialog>,
    private api_service: APIService,
  ) {

  }

  createProject() {
    this.api_service.postProject(
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
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  dataSource: PaginatedDataSource;
  displayedColumns: string[] = ['title', 'description', 'pipelines', 'mtime'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api_service: APIService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.dataSource = new PaginatedDataSource(
      this.api_service,
      this.paginator,
    );
    this.dataSource.loadResults('getProjects');
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(
      tap(
        () => this.loadPage()
      )
    ).subscribe();
  }

  loadPage() {
    this.dataSource.loadResults('getProjects');
  }

  createProjectDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectDialog)
  }
}
