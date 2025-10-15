export interface IQueryResult<TData> {
    data: TData[];
    total: number;
    page: number;
    limit: number;
    
}

export interface IApiResponse<T> {
    message: string;
    status: Boolean;
    error?: unknown;
    data?: T
}