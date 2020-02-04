import * as multer from 'multer';
import { fsMakeDirIfNotExists } from './fs.helper';
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerStorageMaker = (folder: string) => {
    return multer.diskStorage({
        destination: async (req, file, cb) => {
            await fsMakeDirIfNotExists(folder);
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '__' + file.originalname);
        },
    });
};


