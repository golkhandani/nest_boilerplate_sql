import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { MongooseModule } from '@nestjs/mongoose';

import { UserModelName, UserSchema } from '@shared/models/users.model';
import { UsersProfileController } from './profiles.controller';
import { UsersProfileProvider } from './profiles.provider';
import { redisConstants } from '@shared/constants';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { multerStorageMaker } from '@shared/helpers';

export const tempfolder: string = `./statics/users/pictures`;
export const storage = multerStorageMaker(tempfolder);
export const multerOptions: MulterModuleOptions = {
    storage,
};
@Module({
    imports: [
        MulterModule.register(multerOptions),
        // TODO: send redis uri to env
        CacheModule.register({
            store: redisStore,
            redisConstants,
        }),
        MongooseModule.forFeature([{ name: UserModelName, schema: UserSchema }]),
    ],
    controllers: [UsersProfileController],
    providers: [UsersProfileProvider],
    exports: [UsersProfileProvider],
})
export class UsersProfileModule { }
