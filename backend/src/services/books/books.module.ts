import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModelName, BookSchema } from './models/book.model';
import { BooksProvider } from './books.provider';
import { UsersProfileModule } from '@services/profiles/profiles.modules';
import { BooksResolver } from './books.resolver';
import { DateScalar } from '@shared/scalars/date.scalar';
import { BooksContoller } from './books.controllers';

@Module({
    imports: [
        UsersProfileModule,
        MongooseModule.forFeature([{ name: BookModelName, schema: BookSchema }]),
    ],
    controllers: [BooksContoller],
    providers: [BooksResolver, BooksProvider, DateScalar],
})
export class BookModule { }

