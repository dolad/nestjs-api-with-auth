import { SuperTest, Test } from 'supertest';
import supertest from 'supertest';
import { app } from '../app.e2e-spec';
import { invalidMockkycStage1, mockkycStage1 } from './mockdata';
import { HttpStatus } from '@nestjs/common';
import { testUser } from '../auth/mockUser';

export const UnauthoriedBusinessEntityEndpoint = () => {
  it('/business-entity/kyc/stage-1 (POST) should not create if not logged in', async () => {
    const request = supertest(app.getHttpServer());
    const response = await request
      .post('/business-entity/kyc/stage-1')
      .send(mockkycStage1);
    expect(response.body.status).toBe(false);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });
};

export const businessEntityEndpoint = () => {
  let request: SuperTest<Test>;
  let token: string;
  let samepleShareHolderId: string;
  beforeEach(async () => {
    request = supertest(app.getHttpServer());
    const response = await request.post('/auth/login').send(testUser);
    token = response.body.data.token;
  });

  it('/business-entity/kyc/stage-1 (POST) should not with wrong owner details', async () => {
    const response = await request
      .post('/business-entity/kyc/stage-1')
      .send(invalidMockkycStage1)
      .set('Authorization', `Bearer ${token}`);
    expect(response.body.status).toBe(false);
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('/business-entity/kyc/stage-1 (POST) should create if not logged in', async () => {
    const response = await request
      .post('/business-entity/kyc/stage-1')
      .send(mockkycStage1)
      .set('Authorization', `Bearer ${token}`);
    expect(response.body.status).toBe(true);
    expect(response.statusCode).toBe(HttpStatus.CREATED);
  });

  it('/business-entity/kyc (GET) should create if not logged in', async () => {
    const response = await request
      .get('/business-entity/kyc')
      .set('Authorization', `Bearer ${token}`);
    expect(response.body.status).toBe(true);
    expect(response.statusCode).toBe(HttpStatus.OK);
    samepleShareHolderId = response.body.data.shareholders[0].id;
    expect(response.body.data.shareholders.length).toBe(mockkycStage1.length);
    expect(response.body.data.kycStep).toBe(1);
  });
};
