import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { ModuleRef } from '@nestjs/core';
import { PrismaService } from 'src/common/helpers/db/prisma.service';
import { PrismaModule } from 'src/common/helpers/db/prisma.module';
import cookieParser from 'cookie-parser';

let app: INestApplication;
let prisma: PrismaService;
let adminCookie: string;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  prisma = moduleFixture.get(PrismaService);
  await prisma.cleanDbAndCreateProfileTesting();
  await app.init();
  const adminLogin = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: 'percobaan@gmail.com',
      password: '12345',
    });
  expect(adminLogin.status).toEqual(201);
  adminCookie = adminLogin.header['set-cookie'];
});

describe('Profiles Controller Without Login ', () => {
  //   try {
  //     const moduleFixture: TestingModule = await Test.createTestingModule({
  //       imports: [AppModule, PrismaModule],
  //     }).compile();

  //     app = moduleFixture.createNestApplication();
  //     app.use(cookieParser());
  //     prisma = moduleFixture.get(PrismaService);
  //     await app.init();

  //     // Clean database before each test
  //     await prisma.cleanDatabase();
  //     // Login as admin user
  //     // const admin = { email: 'percobaan@gmail.com', password: '12345' };
  //     // const resAdmin = await request(app.getHttpServer())
  //     //   .post('/auth/login')
  //     //   .send(admin);
  //     // expect(resAdmin.status).toEqual(201);
  //     // cookieAdmin = resAdmin.headers['set-cookie'];

  //     // Login as regular user
  //     // const user = { email: 'user@gmail.com', password: '12345' };
  //     // const resUser = await request(app.getHttpServer())
  //     //   .post('/auth/login')
  //     //   .send(user);
  //     // expect(resUser.status).toEqual(201);
  //     // cookieUser = resUser.headers['set-cookie'];

  //     // Login as percobaan user
  //     // const percobaan = {
  //     //   email: 'percobaan2@gmail.com',
  //     //   password: '12345',
  //     // };
  //     // const resPercobaan = await request(app.getHttpServer())
  //     //   .post('/auth/login')
  //     //   .send(percobaan);
  //     // expect(resPercobaan.status).toEqual(201);
  //     // cookiePercobaan = resPercobaan.headers['set-cookie'];
  //   } catch (error) {
  //     Logger.error(error);
  //   }
  // });

  it('GET ALL BEFORE LOGIN SHOULD RETURN UNAUTHORIZED (401)', async () => {
    const response = await request(app.getHttpServer()).get('/api/profiles');
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
  it('GET BY ID BEFORE LOGIN SHOULD RETURN UNAUTHORIZED (401)', async () => {
    const response = await request(app.getHttpServer()).get('/api/profiles/1');
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
  it('DELETE BEFORE LOGIN SHOULD RETURN UNAUTHORIZED (401)', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/api/profiles/1',
    );
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  // afterEach(async () => {
  //   await app.close();
  // });
});

describe('Profile Controller with Login', () => {
  it('GET ALL with LOGIN SHOULD RETURN 200', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profiles')
      .set('Cookie', adminCookie)
      .expect(200);
    expect(response.body).toHaveProperty('profiles');
    expect(response.body.profiles).toBeInstanceOf(Array);
    expect(response.body.profiles[0]).toHaveProperty('UserId');
    expect(response.body.profiles[0]).toHaveProperty('age');
    expect(response.body.profiles[0]).toHaveProperty('gender');
    expect(response.body.profiles[0]).toHaveProperty('name');
    expect(response.body.profiles[0]).toHaveProperty('user');
    expect(response.body.profiles[0].user).toBeInstanceOf(Object);
    expect(response.body.profiles[0].user).toHaveProperty('email');
    expect(response.body.profiles[0].user).toHaveProperty('role');
    expect(response.body.profiles[0].user).toHaveProperty('username');

    return response;
  });
  it('GET user by id with LOGIN SHOULD RETURN 200', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profiles/1')
      .set('Cookie', adminCookie);
    expect(response.status).toEqual(200);
    return response;
  });
});
