import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersProfileProvider } from '../src/services/profiles/profiles.provider';
import { UsersProfileModule } from '../src/services/profiles/profiles.modules';
import { UsersModule } from '../src/services/users/users.module';

describe('Profile', () => {
    let app: INestApplication;
    const usersProfileProvider = { sayHello: async (user) => ['test'] };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [UsersModule, UsersProfileModule],
        })
            .overrideProvider(UsersProfileProvider)
            .useValue(usersProfileProvider)
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    it(`/GET me`, () => {
        return request(app.getHttpServer())
            .get('/me')
            .expect(401)
            .expect({
                data: usersProfileProvider.sayHello('hi'),
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
