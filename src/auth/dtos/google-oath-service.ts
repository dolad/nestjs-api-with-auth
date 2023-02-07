import { Injectable } from "@nestjs/common";
import {google} from "googleapis";

export async function googleOathVerify (tokenCode: string): Promise<any> {
    
    const clientLibary = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRET,
        process.env.CALLBACK_URL
    );

    const {tokens} = await clientLibary.getToken(tokenCode);
    clientLibary.setCredentials(tokens);
    const googleAuth = google.oauth2({
        version: "v2",
        auth: clientLibary,
      });
    
    const googleUserInfo = await googleAuth.userinfo.get();
    return googleUserInfo.data;
   
}