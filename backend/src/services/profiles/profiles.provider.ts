import { Model } from 'mongoose';

import { BadRequestException, Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MulterFile } from '@shared/dtos/file.dto';

import { User, UserModelName } from '../../shared/models/users.model';
import { UpdateUser } from './dtos';
import { CacheManager } from '@shared/interfaces/cache.interface';
import { UserInHeader } from '@shared/decorators';

@Injectable()
export class UsersProfileProvider {
    constructor(
        @InjectModel(UserModelName) private readonly UserModel: Model<User>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager) {

    }
    async sayHello(user: User): Promise<User> {
        const eu = await this.UserModel.findById(user._id);
        return eu;
    }
    /**
     * get all users profile(just available to admin)
     */
    async getProfiles(): Promise<User[]> {
        const eu = await this.UserModel.find().lean();
        return eu;
    }
    /**
     * get user specific profile
     * @param user payload user from jwt contain _id
     */
    async getProfile(user: UserInHeader): Promise<User> {
        const eu = await this.UserModel.findById(user._id);
        return eu;
    }
    async updateProfile(user: UserInHeader, updates: UpdateUser): Promise<User> {
        const eu = await this.UserModel.findByIdAndUpdate(user._id, { $set: updates }, { new: true });
        return eu;

    }
    /**
     * add profile picture to user
     * @param user payload user from jwt contain _id
     * @param file uploaded file from user
     */
    async updateProfilePicture(user: UserInHeader, file: MulterFile): Promise<User> {
        if (!file) {
            throw new BadRequestException('select file');
        } else {
            const pictureUpdate = {
                $set: { picture: file.path },
            };
            const eu = await this.UserModel.findByIdAndUpdate(
                user._id,
                pictureUpdate,
                { new: true },
            );
            return eu;
        }
    }
}
