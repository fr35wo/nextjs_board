export interface RspTemplate<T> {
    statusCode: number;
    message: string;
    data: T;
}
