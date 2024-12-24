import 'module-alias/register';
import dokeBoss from '../../src/index';

export function getDoku() {
    return dokeBoss;
}

export function getByteHash(str: Buffer) {
    return require('crypto').createHash('sha256').update(str).digest('hex');
}