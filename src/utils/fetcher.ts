import axios, { AxiosInstance } from "axios";
import appConfig from "src/config/app.config";

export interface IHttpClientParams {
    baseUrl: string;
    appId?: string;
    secret?: string;  
}



export const httpClient: AxiosInstance = axios.create({
  baseURL: 'https://www.saltedge.com/api/partners/v1/',
  headers:  {
    Accept: 'application/json',
    'Content-type': 'application/json',
    "App-id": appConfig().saltEdge.appId,
    "Secret": appConfig().saltEdge.secret
  }})


export function RutterClient(params:IHttpClientParams): AxiosInstance {
    return axios.create({
     baseURL: params.baseUrl,
     headers:  {
       Accept: 'application/json',
     }
   })
}