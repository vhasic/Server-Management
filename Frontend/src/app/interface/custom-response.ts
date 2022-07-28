import { Server } from "./Server";

// Represents response from backed server
export interface CustomResponse {
    timestamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data: { servers?: Server[], server?: Server }; // ? means optional, it is possible that marked property is not present
}
