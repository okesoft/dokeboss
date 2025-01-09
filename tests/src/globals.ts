import 'module-alias/register';
import dokeBoss from '../../src/index';
import fs from 'fs';
import fg from 'fast-glob';
import * as ExifReader from 'exifreader';
import sizeOf from 'image-size'

export function getDoku() {
    return dokeBoss;
}

export function getByteHash(str: Buffer) {
    return require('crypto').createHash('sha256').update(str).digest('hex');
}

export async function getImageDimentions(filePath: string) {
    const params = await ExifReader.load(filePath);

    let width = params.ImageWidth?.value || params['Image Width']?.value || 0;
    let height = params.ImageHeight?.value || params['Image Height']?.value || 0;

    if (!width || !height) {
        const dimensions = sizeOf(filePath);
        width = dimensions.width || 0;
        height = dimensions.height || 0
    }

    return {
        width,
        height,
        type: params.FileType?.value || ''
    }
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