
export interface IResponseMessage {
    message: string;
    data: string;
    status: boolean
}

export const wrapResponseMessage = (message: string, data: any) : IResponseMessage => {
    return {
        message,
        data,
        status: true
    }
}