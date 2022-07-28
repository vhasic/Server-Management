import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { DataState } from "../enum/data-state.enum";
import { Status } from "../enum/status.enum";
import { CustomResponse } from "../interface/custom-response";
import { Server } from "../interface/Server";

//Class for making http requests
//Dependency injection is used to inject the HttpClient service into the constructor
@Injectable({providedIn: "root"})
export class ServerService {
    private readonly apiUrl: string = 'http://localhost:8080';

    constructor(private http : HttpClient) {  }

    // Reactive approach is asynchronous 
    // $ denotes that variable is an Observable
    // Observable is a class that can be subscribed to, and that delivers messages to subscribers
    servers$ = (page: number, limit: number) => this.http.get<CustomResponse>(`${this.apiUrl}/api/v1/server/list?page=${page}&limit=${limit}`).pipe(
        tap(console.log),
        catchError(this.handleError)
    );

    // Observable that takes parameter server, which is sent into request body
    save$ = (server: Server) => {
        return <Observable<CustomResponse>>this.http.post<CustomResponse>(`${this.apiUrl}/api/v1/server/save`, server).pipe(
            tap(console.log),
            catchError(this.handleError)
        );
    };

    ping$ = (ipAddress: String) => {
        return <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/api/v1/server/ping?ipAddress=${ipAddress}`).pipe(
            tap(console.log),
            catchError(this.handleError)
        );
    };

    // filtering servers by status
    // manually creating the Observable
    filter$ = (status: Status, response: CustomResponse) => {
        return new Observable<CustomResponse>(subscriber => { //callback function
            console.log(response);
            subscriber.next( //next emits the value to whoever is subscribed to the Observable
                //returning object based on status
                status===Status.ALL ? {...response, message:`Servers filtered by ${status} status`} // taking all from response and overriding message
                : {
                    ...response,
                    message: response!.data!.servers!.filter(server => server.status === status).length > 0 
                    ? `Servers filtered by ${status === Status.SERVER_UP ? `Server up`: `Server down`} status` 
                    : `No servers found with ${status} status`,
                    data: { servers: response!.data!.servers!.filter(server => server.status === status) }
                } // overriding message and data
            );
            subscriber.complete(); // completed observable
        }).pipe(    // catching possible errors
            tap(console.log),
            catchError(this.handleError)
        );
    };


    // http methods return Observable that is casted to Observable<CustomResponse>
    delete$ = (serverId: number) => {
        return <Observable<CustomResponse>>this.http.delete<CustomResponse>(`${this.apiUrl}/api/v1/server/delete/${serverId}`).pipe(
            tap(console.log),
            catchError(this.handleError)
        );
    };

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.log(error);
        return throwError (`An error occurred - Error code: ${error.status} Message: ${error.message}`);
    }
}

// servers$: Observable<CustomResponse> = this.http.get<CustomResponse>(`${this.apiUrl}/api/v1/server/list`).pipe(
//     tap(console.log),
//     catchError(this.handleError)
// );

/* // this is procedural way of doing it and it is synchronous
getServers() : Observable<CustomResponse> {
    return this.http.get<CustomResponse>('http://localhost:3000/api/v1/server/list');
} */