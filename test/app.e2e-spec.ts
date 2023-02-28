import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { authenticationEndpoint } from './auth/auth.spec';
import {businessEntityEndpoint, UnauthoriedBusinessEntityEndpoint} from "./business-entity/business-entity.spec"

export let app: INestApplication;
describe('AppController (e2e)', () => {
 
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Authentication endpoint (e2e)', authenticationEndpoint)
  describe('Business endpoint (e2e) Unauthorized', UnauthoriedBusinessEntityEndpoint)
  describe('Business endpoint (e2e)', businessEntityEndpoint)


  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
