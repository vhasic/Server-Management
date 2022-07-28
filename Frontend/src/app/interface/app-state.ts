
import { DataState } from "../enum/data-state.enum";

/*
* Generic interface that represents state of entire application
* T is the type of data that is being stored in the state, and it is CustomResponse that we defined in interface/custom-response.ts
*/
export interface AppState<T> {
    dataState: DataState;
    appData?: T;
    error?: string;
}