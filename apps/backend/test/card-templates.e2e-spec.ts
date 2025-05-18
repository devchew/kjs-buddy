import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Card Templates Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let testTemplateId: string;

  // Test user for authentication
  const testUser = {
    email: 'templatetest@example.com',
    password: 'Test123!',
    username: 'templatetestuser',
  };

  // Test card template data
  const testTemplate = {
    isPublic: true,
    card: {
      name: 'Test Template',
      description: 'This is a test card template',
      cardNumber: 1,
      carNumber: 69,
      date: '2025-04-26',
      logo: 'logo.png',
      sponsorLogo: 'sponsor.png',
      panels: [
        {
          number: 1,
          name: 'Test Panel',
          finishTime: 0,
          provisionalStartTime: 34200000,
          actualStartTime: 34200000,
          drivingTime: 0,
          resultTime: 0,
          nextPKCTime: 0,
          arrivalTime: 0,
        },
      ],
    },
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

  describe('Card Templates CRUD Operations', () => {
    it('should create a new card template with valid data and authentication', () => {
      return request(app.getHttpServer())
        .post('/cards/templates/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTemplate)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', testTemplate.card.name);
          expect(res.body).toHaveProperty(
            'description',
            testTemplate.card.description,
          );
          expect(res.body).toHaveProperty('isPublic', testTemplate.isPublic);
          expect(res.body).toHaveProperty('panels');
          expect(res.body).toHaveProperty(
            'cardNumber',
            testTemplate.card.cardNumber,
          );
          expect(res.body).toHaveProperty(
            'carNumber',
            testTemplate.card.carNumber,
          );
          expect(res.body).toHaveProperty('date', testTemplate.card.date);

          // Save the template ID for later tests
          testTemplateId = res.body.id;
        });
    });

    it('should not create a card template without authentication', () => {
      return request(app.getHttpServer())
        .post('/cards/templates/create')
        .send(testTemplate)
        .expect(401);
    });

    it('should get all public card templates without authentication', () => {
      return request(app.getHttpServer())
        .get('/cards/templates/all')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    it('should get a specific card template by ID', () => {
      return request(app.getHttpServer())
        .get(`/cards/templates/${testTemplateId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testTemplateId);
          expect(res.body).toHaveProperty('name', testTemplate.card.name);
        });
    });

    it('should update a card template with valid data and authentication', () => {
      const updatedTemplate = {
        isPublic: true,
        card: {
          ...testTemplate.card,
          name: 'Updated Template Name',
        },
      };

      return request(app.getHttpServer())
        .put(`/cards/templates/${testTemplateId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedTemplate)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', testTemplateId);
          expect(res.body).toHaveProperty('name', updatedTemplate.card.name);
        });
    });

    it('should not update a card template without authentication', () => {
      const updatedTemplate = {
        isPublic: true,
        card: {
          ...testTemplate.card,
          name: 'Another Updated Name',
        },
      };

      return request(app.getHttpServer())
        .put(`/cards/templates/${testTemplateId}`)
        .send(updatedTemplate)
        .expect(401);
    });

    it('should delete a card template with valid authentication', () => {
      return request(app.getHttpServer())
        .delete(`/cards/templates/${testTemplateId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should verify the card template was deleted', () => {
      return request(app.getHttpServer())
        .get(`/cards/templates/${testTemplateId}`)
        .expect(404);
    });
  });
});
