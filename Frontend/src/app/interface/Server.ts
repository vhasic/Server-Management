import { Status } from "../enum/status.enum";

/*
 * This interface is used to represent backend server.
*/
export interface Server{
    id: number;
    ipAddress: string;
    name: string;
    memory:string;
    type:string;
    imageURL:string;
    status: Status;
}