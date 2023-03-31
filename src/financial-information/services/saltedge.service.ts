import { Injectable } from "@nestjs/common";
import { httpClient } from "../../utils/fetcher";

import { leadPayloadGenerator, createConnectionPayload } from "../mockRequest/connection";

@Injectable()
export class SaltEdge {

   
    async createLeads(identifier: string){
    
       const response = await httpClient.post('leads', {
            data: {
                email: identifier
            }, 
       })
        
        return response;

    }

    async listAllCustomers(){
        return await httpClient.get('customers')
     }

    //  save this for account retrieval
    async createLeadSession( customerId: string){
        const payload = leadPayloadGenerator(customerId);

        const response = await httpClient.post('lead_sessions/create', {
            data: payload
        });
    
        return response.data.data;
     }

     

    //  fetch Account
    async fetchAccount(){
        return await httpClient.get('account', {
            data: {
                createConnectionPayload
            }
        })
     }

    //  fetchProviders
    async fetchProvider(countriesCode: string): Promise<any>{
        return await httpClient.get(`providers?include_fake_providers=true&country_code=${countriesCode}`)
    }
   /**
     * 
     * @returns list of saltEdgeProviderCountries should not be used unless you have agreed to add other countries
     */
    async fetchCountries(){
        return await httpClient.get('countries?include_fake_providers=true', {
        })
    }

    /**
     * 
     * @returns list of active connections for fetching user accounts
     */
     async fetchConnection(customerId: string){
        return await httpClient.get(`connections?customer_id=${customerId}`, {
        })
    }

    /**
     * 
     * @returns list of active connections for fetching user accounts
     */
     async fetchAccounts(connectionId: string){
        return await httpClient.get(`accounts?connection_id=${connectionId}`, {
        })
    }

     /**
     * 
     * @returns list of active connections for fetching user accounts
     */
      async fetchTransaction(connectionId: string, accountId){
        return await httpClient.get(`transactions?connection_id=${connectionId}&account_id=${accountId}`, {
        })
    }

    



}