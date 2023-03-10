import { Inject, Injectable } from "@nestjs/common";
import { RutterClient } from "../../utils/fetcher";
import appConfig from "src/config/app.config";
import { AxiosInstance } from "axios";

@Injectable()
export class RutterServices {
    private rutterClient: AxiosInstance;
    constructor(){
       this.initialClient();
    }

    // instantiate saltEdgeClient
    private async initialClient(): Promise<void> {
        this.rutterClient = RutterClient({
            baseUrl: appConfig().saltEdge.baseUrl
        })
    }

    async exchangeToken(token: string){
        return await this.rutterClient.post('item/public_token/exchange', {
            client_id: appConfig().rutter.appId,
            secret: appConfig().rutter.secret,
            public_token: token
        })
    }

    // create customer to begin transactions; 
    // store customer information to retrieve connections

   

   

   
   
   



    



}