import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Cards Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let testCardId: string;

  // Test user for authentication
  const testUser = {
    email: 'cardtest@example.com',
    password: 'Test123!',
    username: 'cardtestuser',
  };

  // Test card data using the updated CardDto structure
  const testCard = {
    name: 'Rally Test',
    cardNumber: 1,
    carNumber: 69,
    date: '2025-04-26',
    logo: 'logo.png',
    sponsorLogo: 'sponsor.png',
    panels: [
      {
        number: 1,
        name: 'PS1 - Test Stage',
        finishTime: 0,
        provisionalStartTime: 34200000,
        actualStartTime: 34200000,
        drivingTime: 300000,
        resultTime: 0,
        nextPKCTime: 0,
        arrivalTime: 0,
      },
    ],
    description: 'Test card description',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // Register and login to get auth token for protected routes
    await request(app.getHttpServer()).post('/auth/register').send(testUser);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Cards CRUD Operations', () => {
    it('should create a new card with valid data and authentication', () => {
      return request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCard)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', testCard.name);
          expect(res.body).toHaveProperty('cardNumber', testCard.cardNumber);
          expect(res.body).toHaveProperty('carNumber', testCard.carNumber);
          expect(res.body).toHaveProperty('date', testCard.date);
          expect(res.body).toHaveProperty('logo', testCard.logo);
          expect(res.body).toHaveProperty('sponsorLogo', testCard.sponsorLogo);
          expect(res.body).toHaveProperty('panels');

          // Save the card ID for later tests
          testCardId = res.body.id;
        });
    });

    it('should not create a card without authentication', () => {
      return request(app.getHttpServer())
        .post('/cards')
        .send(testCard)
        .expect(401);
    });

    it('should get all cards for authenticated user', () => {
      return request(app.getHttpServer())
        .get('/cards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get a specific card by ID', () => {
      return request(app.getHttpServer())
        .get(`/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testCardId);
          expect(res.body).toHaveProperty('name', testCard.name);
        });
    });

    it('should update a card with valid data and authentication', () => {
      const updatedCard = { ...testCard, name: 'Updated Rally Name' };

      return request(app.getHttpServer())
        .put(`/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedCard)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testCardId);
          expect(res.body).toHaveProperty('name', updatedCard.name);
        });
    });

    it('should delete a card with valid authentication', () => {
      return request(app.getHttpServer())
        .delete(`/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should verify the card was deleted', () => {
      return request(app.getHttpServer())
        .get(`/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
