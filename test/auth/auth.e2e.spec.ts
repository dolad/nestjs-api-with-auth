import {SuperTest, Test }  from "supertest";
import supertest  from "supertest";
import { app } from "../app.e2e-spec"
import { HttpStatus } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";



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

    it('/register', async() => {
       const eventSpy = jest.spyOn(EventEmitter2.prototype, "emit").mockImplementation(() => null)
       const response = await request.post('/auth/register').send(testUser);
       expect(response.body.status).toBe(true);
       expect(response.statusCode).toBe(HttpStatus.CREATED);
       expect(eventSpy).toBeCalled()
    })
}
