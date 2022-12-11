import { ApiResponseCode } from "src/app/shared/enums/statusCode.enum";

export interface IApiResponse<T>{
    message: string;
    data: T;
    statusCode: number;
    errors: IErrorResponse[];
}

export interface IErrorResponse{
    title: string;
    message: string;
}

export class ApiResponse<T>{
    message: string;
    data: T;
    statusCode: number;
    errors: IErrorResponse[];
    responseCode?:ApiResponseCode;
}

export interface IApiResponse<T>{
    message: string;
    data: T;
    statusCode: number;
    errors: IErrorResponse[];
    responseCode?:ApiResponseCode;
}
