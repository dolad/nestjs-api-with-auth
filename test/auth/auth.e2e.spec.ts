import {SuperTest, Test }  from "supertest";
import supertest  from "supertest";
import { app } from "../app.e2e-spec"
import { HttpStatus } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "../../src/storage/postgres/user.schema";



const testUser = {
    email: "adolad2019@gmail.com",
    password: "adminpassword",
    firstName: "developer",
    lastName: "testing"
}

export const authenticationEndpoint = () => {
    let request: SuperTest<Test>;
    beforeEach(() =>  {
        request = supertest(app.getHttpServer())
    })

    it('/register should register a new user', async() => {
       const eventSpy = jest.spyOn(EventEmitter2.prototype   , "emit").mockImplementation(() => null)
       const response = await request.post('/auth/register').send(testUser);
       expect(response.body.status).toBe(true);
       expect(response.statusCode).toBe(HttpStatus.CREATED);
       expect(eventSpy).toBeCalled()
    })

    it('/login should not login if user not verified email', async() => {
        const response = await request.post('/auth/login').send(testUser);
        expect(response.body.status).toBe(false);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toBe("user registration is not complete please check your email and verify");
     })

     it('/login should not login if user not verified email', async() => {
       await User.update({
            isConfirmed: true
        },{
            where:{
                email: testUser.email
            }
        })
        const response = await request.post('/auth/login').send(testUser);
        expect(response.body.status).toBe(true);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.data.token).toBeDefined()
     })

}
