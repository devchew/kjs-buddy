import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Cards Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let testCardId: number;
  
  // Test user for authentication
  const testUser = {
    email: 'cardtest@example.com',
    password: 'Test123!',
    username: 'cardtestuser',
  };

  // Test card data
  const testCard = {
    title: 'Test Card',
    content: 'This is a test card',
    tags: ['test', 'e2e'],
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
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);
    
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
          expect(res.body).toHaveProperty('title', testCard.title);
          expect(res.body).toHaveProperty('content', testCard.content);
          expect(res.body.tags).toEqual(expect.arrayContaining(testCard.tags));
          
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
          expect(res.body).toHaveProperty('title', testCard.title);
        });
    });

    it('should update a card with valid data and authentication', () => {
      const updatedCard = { ...testCard, title: 'Updated Card Title' };
      
      return request(app.getHttpServer())
        .put(`/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedCard)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testCardId);
          expect(res.body).toHaveProperty('title', updatedCard.title);
        });
    });

    it('should delete a card with valid authentication', () => {
      return request(app.getHttpServer())
        .delete(`/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should verify the card was deleted', () => {
      return request(app.getHttpServer())
        .get(`/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});