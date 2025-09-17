import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { ModuleRef } from '@nestjs/core';
import { PrismaService } from 'src/common/helpers/db/prisma.service';
import { PrismaModule } from 'src/common/helpers/db/prisma.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { PrismaErrorFilter } from 'src/common/filters/prisma.filter';

let app: INestApplication;
let prisma: PrismaService;
let adminCookie: string;
const newUser = {
  name: 'Bikin Baru',
  age: 23,
  gender: 'FEMALE',
  user: {
    email: 'baru@gmail.com',
    password: '12345',
    role: 'USER',
    username: 'bikinbaru',
  },
};

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaErrorFilter(), new HttpExceptionFilter());

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
  it('SUCCESSFULLY CREATE USER', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/profiles')
      .send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Profile successfully created');
    expect(response.body).toHaveProperty('profile');
    expect(response.body.profile).toBeInstanceOf(Object);
    expect(response.body.profile).toHaveProperty('UserId');
    expect(response.body.profile).toHaveProperty('age');
    expect(response.body.profile).toHaveProperty('gender');
    expect(response.body.profile).toHaveProperty('id');
    expect(response.body.profile).toHaveProperty('UserId');
  });
  it('DELETE NEW USER UNAUTHORIZED (401) ', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/api/profiles/4',
    );
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
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
      .get('/api/profiles/3')
      .set('Cookie', adminCookie);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('profile');
    expect(response.body.profile).toBeInstanceOf(Object);
    expect(response.body.profile).toHaveProperty('UserId');
    expect(response.body.profile).toHaveProperty('age');
    expect(response.body.profile).toHaveProperty('gender');
    expect(response.body.profile).toHaveProperty('id');
    expect(response.body.profile).toHaveProperty('name');
    expect(response.body.profile).toHaveProperty('user');
    expect(response.body.profile.user).toBeInstanceOf(Object);
    expect(response.body.profile.user).toHaveProperty('email');
    expect(response.body.profile.user).toHaveProperty('role');
    expect(response.body.profile.user).toHaveProperty('username');

    return response;
  });
  it('GET user by id NOT FOUND with LOGIN SHOULD RETURN 404', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profiles/10')
      .set('Cookie', adminCookie);
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Profile user not found');
    expect(response.body).toHaveProperty('method');
    expect(response.body.method).toEqual('GET');
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body.statusCode).toEqual(404);

    return response;
  });
  it('DELETE NEW USER with LOGIN SHOULD RETURN (200) ', async () => {
    const response = await request(app.getHttpServer())
      .delete('/api/profiles/4')
      .set('Cookie', adminCookie);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(
      `Username ${newUser.user.username} succesfully deleted`,
    );
  });
  it('DELETE NOT FOUND USER after deleted with LOGIN SHOULD RETURN (404) ', async () => {
    const response = await request(app.getHttpServer())
      .delete('/api/profiles/10')
      .set('Cookie', adminCookie);
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('No record was found');
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body.statusCode).toEqual(404);
    expect(response.body).toHaveProperty('type');
    expect(response.body.type).toEqual('PrismaErrorInstance');
  });
});

afterEach(async () => {
  // adminCookie = '';
  await app.close();
});
