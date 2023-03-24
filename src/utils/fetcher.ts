import axios, { AxiosInstance } from "axios";

export interface IHttpClientParams {
    baseUrl: string;
    appId?: string;
    secret?: string;  
}



export function HttpClient(params:IHttpClientParams): AxiosInstance {
 return axios.create({
  baseURL: params.baseUrl,
  headers:  {
    Accept: 'application/json',
    "App-id": params.appId,
    "Secret": params.secret
  }
})

}

export function RutterClient(params:IHttpClientParams): AxiosInstance {
    return axios.create({
     baseURL: params.baseUrl,
     headers:  {
       Accept: 'application/json',
     }
   })
}