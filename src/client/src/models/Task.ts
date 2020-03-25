export enum ETaskStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface ITask {
    id: string;
    url: string;
    downloaded?: number;
    total?: number;
    status: ETaskStatus;
    message?: string;
    filepath?: string;
}
