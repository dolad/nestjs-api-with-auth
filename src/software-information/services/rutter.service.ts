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
            baseUrl: appConfig().rutter.baseUrl
        })
    }

    async exchangeToken(token: string){
        try {
            return await this.rutterClient.post('item/public_token/exchange', {
                client_id: "3489bd0f-7c51-403a-9901-fe8207796b0d" || appConfig().rutter.appId,
                secret: "5341e7d6-2d14-49f7-a6b3-60213ad38255" || appConfig().rutter.secret,
                public_token: "677ede12-18f1-46d8-bcf0-c61bd6479325" || token
            })
        } catch (error) {
            console.log(error);
        }
       
    }

    // create customer to begin transactions; 
    // store customer information to retrieve connections

   

   

   
   
   



    



}