import { Inject, Injectable } from "@nestjs/common";
import { HttpClient } from "../../utils/fetcher";
import appConfig from "src/config/app.config";
import {AxiosInstance} from "axios";
import { leadPayloadGenerator, createConnectionPayload } from "../mockRequest/connection";

@Injectable()
export class SaltEdge {
    private saltClient: AxiosInstance;
    constructor(){
       this.initialSaltEdgeClient();
    }

    // instantiate saltEdgeClient
    private async initialSaltEdgeClient(): Promise<void> {
        this.saltClient = HttpClient({
            baseUrl: appConfig().saltEdge.baseUrl,
            appId: appConfig().saltEdge.appId,
            secret: appConfig().saltEdge.secret,
        })
    }

    // create customer to begin transactions; 
    // store customer information to retrieve connections

    async createLeads(identifier: string){
       return await this.saltClient.post('leads', {
            data: {
                email: identifier
            }
        })
    }

    async listAllCustomers(){
        return await this.saltClient.get('customers')
     }

    //  save this for account retrieval
    async createLeadSession( customerId: string){
        const payload = leadPayloadGenerator(customerId);
        const response = await this.saltClient.post('lead_sessions/create', {
            data: payload
        });
        return response.data.data;
     }

     

    //  fetch Account
    async fetchAccount(){
        return await this.saltClient.get('account', {
            data: {
                createConnectionPayload
            }
        })
     }

    //  fetchProviders
    async fetchProvider(countriesCode: string): Promise<any>{
        return await this.saltClient.get(`providers?include_fake_providers=true&country_code=${countriesCode}`)
    }
   /**
     * 
     * @returns list of saltEdgeProviderCountries should not be used unless you have agreed to add other countries
     */
    async fetchCountries(){
        return await this.saltClient.get('countries?include_fake_providers=true', {
        })
    }

    /**
     * 
     * @returns list of active connections for fetching user accounts
     */
     async fetchConnection(customerId: string){
        return await this.saltClient.get(`connections?customer_id=${customerId}`, {
        })
    }

    /**
     * 
     * @returns list of active connections for fetching user accounts
     */
     async fetchAccounts(connectionId: string){
        return await this.saltClient.get(`accounts?connection_id=${connectionId}`, {
        })
    }

     /**
     * 
     * @returns list of active connections for fetching user accounts
     */
      async fetchTransaction(connectionId: string, accountId){
        return await this.saltClient.get(`transactions?connection_id=${connectionId}&account_id=${accountId}`, {
        })
    }

    



}