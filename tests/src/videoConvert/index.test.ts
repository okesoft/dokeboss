import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/videoConvert/');
describe('video convert', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('convert mov to mp4 from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'daa05731a30ea2ca70bef8c4b4ab27d5b2c55e800b2af68db38fbc1708c7fb1a';
        const buffer = fs.readFileSync(path + 'video.mov');
        const outputFile = path + 'generated' + r + '.mov.mp4';
        let data = Buffer.from('');

        let hash = "";
        let mime = getDoku().getMimeTypeByExtention('mov');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    }, 25000);


    it('convert mov video to mp4', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'daa05731a30ea2ca70bef8c4b4ab27d5b2c55e800b2af68db38fbc1708c7fb1a';
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.mov.mp4';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    }, 250000);

    it('convert mov video to webm', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.mov.webm';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }


        const stat = fs.lstatSync(outputFile);
        expect(stat.size).toBeGreaterThan(37000000);
        expect(stat.isFile()).toEqual(true);

    }, 250000);

    it('convert mp4 video to webm', async () => {//this is so sloow test. mp4 -> webm is slow operation
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.mp4';
        const outputFile = path + 'generated' + r + '.mp4.webm';

        let data;
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const stat = fs.lstatSync(outputFile);
        expect(stat.size).toBeGreaterThan(5200000);
        expect(stat.isFile()).toEqual(true);

    }, 250000);

});