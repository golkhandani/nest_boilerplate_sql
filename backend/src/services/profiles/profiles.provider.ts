import { Model } from 'mongoose';

import { BadRequestException, Injectable, Inject, CACHE_MANAGER, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MulterFile } from '@shared/dtos/file.dto';

import { User, UserModelName, USER_REPOSITORY_NAME, UserEntity } from '../../shared/models/users.model';
import { UpdateUser } from './dtos';
import { CacheManager } from '@shared/interfaces/cache.interface';
import { UserInHeader } from '@shared/decorators';

@Injectable()
export class UsersProfileProvider {
    constructor(
        @Inject(USER_REPOSITORY_NAME) private readonly usersRepository: typeof UserEntity,

        @InjectModel(UserModelName) private readonly UserModel: Model<User>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager) {

    }
    async sayHello(user: User): Promise<User> {
        // const eu = await this.UserModel.findById(user._id);
        const eu = await this.usersRepository.findOne({ where: {_id: user._id} });
        return eu;
    }
    /**
     * get all users profile(just available to admin)
     */
    async getProfiles(): Promise<User[]> {
        // const eu = await this.UserModel.find().lean();
        const eu = await this.usersRepository.findAndCountAll();
        return eu;
    }
    /**
     * get user specific profile
     * @param user payload user from jwt contain _id
     */
    async getProfile(user: UserInHeader): Promise<User> {
        // const eu = await this.UserModel.findById(user._id);
        const eu = await this.usersRepository.findOne({
             where: {_id: user._id},
             attributes: [
                '_id', 'name',
                'picture', 'address',
                'role', 'verified',
                'createdAt', 'updatedAt'],
        });
        return eu;
    }

    async updateProfile(user: UserInHeader, updates: UpdateUser): Promise<boolean> {
        // const x :UpdateOptions={}
        const [rows, updateds]  = await this.usersRepository.update(
            updates,
            {
                where: {_id: user._id },
                returning: true,
            },
        );

        // const eu = await this.usersRepository.update(
        //     updates,
        //     {
        //         where: {_id: user._id },
        //         plain: true,
        //         returning: true,
        //     },
        // );
        // const eu = await this.UserModel.findByIdAndUpdate(user._id, { $set: updates }, { new: true });
        return updateds[0];

    }
    /**
     * add profile picture to user
     * @param user payload user from jwt contain _id
     * @param file uploaded file from user
     */
    async updateProfilePicture(user: UserInHeader, file: MulterFile): Promise<any> {
        if (!file) {
            throw new BadRequestException('select file');
        } else {
            // const pictureUpdate = {
            //     $set: { picture: file.path },
            // };
            // const eu = await this.UserModel.findByIdAndUpdate(
            //     user._id,
            //     pictureUpdate,
            //     { new: true },
            // );
            const [data, meta] = await this.usersRepository.sequelize.query('SELECT * FROM users');
            console.log('');
            const [rows, updateds] = await this.usersRepository.update(
                { picture: file.path },
                {
                    where: {_id: user._id },
                    returning: true,
                },
            );
            return rows === 1 ? updateds[0] : new NotImplementedException();
        }
    }
}
