import 'module-alias/register';
import dokeBoss from '../../src/index';
import fs from 'fs';
import fg from 'fast-glob';

export function getDoku() {
    return dokeBoss;
}

export function getByteHash(str: Buffer) {
    return require('crypto').createHash('sha256').update(str).digest('hex');
}

export async function removeGenerated(path: string) {
    const entries = await fg(path + 'generated*', { dot: true });
    for (let file of entries) {
        await new Promise(async resolve => {
            fs.rm(file, () => {
                resolve(1);
            });

        });
    }

    return true;
}

export function getPath(path: string) {
    return "./tests/src/" + path;
}