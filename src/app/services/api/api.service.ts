import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Project } from '../../projects/classes/project';
import { Processor } from '../../projects/classes/processor';
import { Pipeline, PipelineResult } from '../../projects/classes/pipeline';
import { projection } from '@angular/core/src/render3/instructions';

const API_URL = environment.apiUrl;
const API_MEDIA_URL = environment.apiMediaUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Token ',
  }),
  params: new HttpParams(),
};

export class PaginatedResponse {
  public pagination = new class {
    count: number;
    public links = new class {
      next: string;
      previous: string;
    };
  };
  results: any[];
}

@Injectable()
export class APIService {
  public API_URL = API_URL;

  constructor(
    private http: HttpClient,
  ) { }

  public getPipelineResultFileURL(result: any): string {
    let result_url = '';
    if (result) {
      if (result.hasOwnProperty('url')) {
        result_url = `${API_MEDIA_URL}${result.url}`;
      }
    }
    return result_url;
  }

  public getPipelineProcesingURL(pipeline_id: string): string {
    return `${API_URL}/pipelines/${pipeline_id}/process/`;
  }

  public getPipelineResultURL(result_id: string): string {
    return `${API_URL}/pipeline_result/${result_id}/`;
  }

  public processPipeline(pipeline: Pipeline, data: any): Observable<PipelineResult> {
    return this.http.post<PipelineResult>(
      this.getPipelineProcesingURL(pipeline.id),
      data,
      this.build_http_options()
    ).pipe(
      catchError(this.handleError)
    );
  }

  public refreshPipelineResult(result_id: string): Observable<PipelineResult> {
    return this.http.get<PipelineResult>(
      this.getPipelineResultURL(result_id),
      this.build_http_options()
    ).pipe(
      catchError(this.handleError)
    );
  }

  public getProcessor(id: string): Observable<Processor> {
    return this.http.get<Processor>(
      `${API_URL}/processors/${id}/`,
      this.build_http_options()
    ).pipe(
      catchError(
        this.handleError
      )
    );
  }

  public postPipeline(
    project: Project,
    title: string,
    description?: string
  ): Observable<Pipeline> {
    return this.http.post<Pipeline>(
      `${API_URL}/pipelines/`,
      {
        'project': project.id,
        'title': title,
        'description': description,
      },
      this.build_http_options(),
    ).pipe(
      catchError(
        this.handleError
      )
    )
  }

  public postProject(title: string, description?: string): Observable<Project> {
    return this.http.post<Project>(
      `${API_URL}/projects/`,
      {
        'title': title,
        'description': description
      },
      this.build_http_options(),
    ).pipe(
      catchError(
        this.handleError
      )
    );
  }

  public putPipeline(pipeline: Pipeline): Observable<Pipeline> {
    return this.http.put<Pipeline>(
      `${API_URL}/pipelines/${pipeline.id}/`,
      pipeline,
      this.build_http_options(),
    ).pipe(
      catchError(
        this.handleError
      )
    );
  }

  public getPipeline(id: string): Observable<Pipeline> {
    return this.http.get<Pipeline>(
      `${API_URL}/pipelines/${id}/`,
      this.build_http_options()
    ).pipe(
      catchError(
        this.handleError
      )
    );
  }

  public getProcessors(
    page?: number,
    page_size?: number,
  ): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(
      `${API_URL}/processors/`,
      this.build_http_options(page, page_size)
    ).pipe(
      catchError(
        this.handleError
      )
    );
  }

  public getProject(id: string): Observable<Project> {
    return this.http.get<Project>(
      `${API_URL}/projects/${id}/`,
      this.build_http_options()
    ).pipe(
      catchError(
        this.handleError
      )
    );
  }

  public getProjects(
    page?: number,
    page_size?: number,
  ): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(
      `${API_URL}/projects/`,
      this.build_http_options(page, page_size)
    ).pipe(
      catchError(
        this.handleError
      )
    );
  }

  private build_http_options(
    page?: number,
    page_size?: number,
  ): object {
    const _httpOptions = httpOptions;
    _httpOptions.headers.set(
      'Authorization', 'Token '
    );
    let params = new HttpParams();

    if (page === undefined) {
      page = 1;
    }

    if (page > -1) {
      params = params.append('page', page.toString());
    }
    if (page_size > -1) {
      params = params.append('page_size', page_size.toString());
    }
    _httpOptions.params = params;

    return _httpOptions;
  }

  public handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}

