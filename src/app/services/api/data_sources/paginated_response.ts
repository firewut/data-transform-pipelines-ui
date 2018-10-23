import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Project } from '../../../projects/classes/project';
import { APIService, PaginatedResponse } from '../api.service';
import { MatPaginator } from '@angular/material';


export class PaginatedDataSource implements DataSource<any> {
    constructor(
        private api_service: APIService,
        private paginator: MatPaginator,
    ) {
        this.paginator.pageSizeOptions = [
            10, 25, 50
        ];
        if (this.paginator.pageSize === undefined) {
            this.paginator.pageSize = this.paginator.pageSizeOptions[0];
        }
    }

    private handler: string;
    private resultsSubject = new BehaviorSubject<Project[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Project[]> {
        return this.resultsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.resultsSubject.complete();
        this.loadingSubject.complete();
    }

    loadResults(
        handler: string,
    ) {
        this.handler = handler;
        this.loadingSubject.next(true);

        this.api_service[handler](
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
        ).pipe(
            catchError(
                this.api_service.handleError
            ),
            finalize(
                () => this.loadingSubject.next(false)
            )
        ).subscribe(
            (paginated_response: PaginatedResponse) => {
                this.paginator.length = paginated_response.pagination.count;
                this.resultsSubject.next(paginated_response.results);
            }
        );
    }

    onPaginateChange(event) {
        this.loadResults(this.handler);
    }
}
