
export  const sucessResponse = (message: string, data: any):IResponse => {
    return {
        status: true,
        message: message,
        data: data,
        error: null
    }
}

export  const errorResponse = (message: string, error: any):IResponse => {
    return {
        status: false,
        message: message,
        data: null,
        error: error
    }
}
interface IResponse {
    status: boolean;
    message: string;
    data: any;
    error: any;
}
export { IResponse };
