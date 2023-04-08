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
    async getConsentWithConnectionId(connectionId: string){
        const response = await httpClient.get(`partner_consents?connection_id=${connectionId}`)
        return response.data.data
     }

    async revokeConsent(consentId: string, customerId:string){
       const url = `partner_consents/${consentId}/revoke?connection_id=${customerId}`;
        const response = await httpClient.put(url);
        response.data.data;
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
    async fetchProvider(): Promise<any>{
        return await httpClient.get(`providers`)
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
        const res = await httpClient.get(`connections?customer_id=${customerId}`, {
        })

        return res.data.data;
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