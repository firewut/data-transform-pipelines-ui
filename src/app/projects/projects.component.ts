import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { APIService } from '../services/api/api.service';
import { PaginatedDataSource } from '../services/api/data_sources/paginated_response';
import { MatPaginator } from '@angular/material';

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
}
