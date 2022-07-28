import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { Server } from './interface/Server';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null); //saving response of server
  filterStatus$ = this.filterSubject.asObservable(); // observes changes on subject filerSubject, and is used on frontend
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  // equivalent to defining private attribute and assigning value in constructor
  // Dependency injecting serverService into class
  constructor(private serverService: ServerService, private notifier: NotifierService) {
    // Initializing appState$ observable. of creates Observable on the fly
    this.appState$ = of({ dataState: DataState.LOADING_STATE });
  }

  // When class initializes this lifecycle method is called
  ngOnInit(): void {
    const page = 0;
    const limit = 10;
    // subscribing to observable that makes http request
    this.appState$ = this.serverService.servers$(page, limit).pipe(
      // pipe is something like .then() in js Promise
      map((response) => {
        this.notifier.notify('success', response.message);
        this.dataSubject.next(response);
        // calling callback function when backend responds
        // reversing servers in order to show newest added servers first
        return {
          dataState: DataState.LOADED_STATE,
          appData: {
            ...response,
            data: { servers: response.data.servers.reverse() },
          },
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }), // starting with loading state while we wait for response; appData is defined as optional and we don't need to pass it
      catchError((error: string) => {
        this.notifier.notify('error', error);
        // error is of type string because we throw string in server.service.ts
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((response) => {
        this.notifier.notify('success', response.message);
        // replacing existing server with updated server from backend
        const index = this.dataSubject.value.data.servers!.findIndex(
          (server) => server.id === response.data.server!.id
        );
        this.dataSubject.value.data.servers![index] = response.data.server!;
        // setting filterSubject to empty string to stop showing loading spinner on frontend
        this.filterSubject.next('');
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notifier.notify('error', error);
        // to stop showing loading spinner on frontend
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  // filtering is done on frontend in server.service.ts and we pass all data that is saved in dataSubject so it can be filtered
  filterServers(status: Status): void {
    this.appState$ = this.serverService
      .filter$(status, this.dataSubject.value)
      .pipe(
        map((response) => {
          this.notifier.notify('success', response.message);
          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          this.notifier.notify('error', error);
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true); //showing spinner on frontend
    this.appState$ = this.serverService.save$(<Server>serverForm.value).pipe(
      map((response) => {
        this.notifier.notify('success', response.message);
        this.dataSubject.next({
          ...response,
          data: {
            servers: [
              response.data.server!,
              ...this.dataSubject.value.data.servers!,
            ],
          },
        }); //adding new server to existing servers on frontend
        document.getElementById('closeModal')!.click(); // closing form modal
        this.isLoading.next(false);
        serverForm.resetForm({ status: this.Status.SERVER_DOWN }); // resetting form and setting status to server down
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notifier.notify('error', error);
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id).pipe(
      map((response) => {
        this.notifier.notify('success', response.message);
        // reassigning servers to new array without deleted server
        this.dataSubject.next({
          ...response,
          data: {
            servers: this.dataSubject.value.data.servers!.filter(
              (s) => s.id !== server.id
            ),
          }, // removing server from servers array
        });
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notifier.notify('error', error);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  // this is plain javascript
  // Downloads servers as table
  printReport(printOption: string): void {
    if (printOption === 'Pdf') {
      window.print(); // opens browser window to save as pdf
    } else {
      let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
      let table = document.getElementById('servers')! as HTMLTableElement;
      let tableHTML = table.outerHTML.replace(/ /g, '%20'); // replacing encoded spaces with url encoded value for space %20
      let downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = `data:${dataType},${tableHTML}`; // link to download file
      downloadLink.download = 'servers-report.xls'; // name of file
      downloadLink.click(); // downloading file
      //removing link from DOM after click
      document.body.removeChild(downloadLink);
    }
  }
}
