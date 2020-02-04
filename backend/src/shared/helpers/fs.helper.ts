import * as fs from 'fs-extra';

export async function fsMakeDirIfNotExists(path) {
    if (!fs.existsSync(path)) { fs.mkdirpSync(path); }
}
