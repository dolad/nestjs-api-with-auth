import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { authenticationEndpoint } from './auth/auth.e2e.spec';
import { EventEmitter2 } from '@nestjs/event-emitter';


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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
