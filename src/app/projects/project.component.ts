import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api/api.service';
import { Project } from './classes/project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  displayedColumns: string[] = ['title', 'description', 'mtime', 'processors'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api_service: APIService,
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
}
