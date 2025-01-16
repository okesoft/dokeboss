import { getDoku, getByteHash, removeGenerated, getVideoDimentions, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/videoConvert/');
describe('video convert', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('convert mov to mp4 from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const buffer = fs.readFileSync(path + 'video.mov');
        const outputFile = path + 'generated' + r + '.mov.mp4';
        let data = Buffer.from('');

        let mime = getDoku().getMimeTypeByExtention('mov');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, duration, type } = await getVideoDimentions(outputFile);
        expect(width).toBe(1080);
        expect(height).toBe(1920);
        expect(type).toBe('mov,mp4,m4a,3gp,3g2,mj2');
        expect(duration).toBeGreaterThan(25);

    }, 100000);


    it('convert mov video to mp4', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.mov.mp4';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, duration, type } = await getVideoDimentions(outputFile);
        expect(width).toBe(1080);
        expect(height).toBe(1920);
        expect(type).toBe('mov,mp4,m4a,3gp,3g2,mj2');
        expect(duration).toBeGreaterThan(25);

    }, 250000);


    //next two test is not work correctly in docker.
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

        let params = {};
        params = await getVideoDimentions(outputFile);


        console.log(1, params);
        const { width, height, duration, type } = params as any;
        expect(width).toBe(1080);
        expect(height).toBe(1920);
        expect(duration).toBeGreaterThan(25);
        expect(type).toBe('matroska,webm');

    }, 600000);

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

        let params = {};
        params = await getVideoDimentions(outputFile);


        console.log(2, params);
        const { width, height, duration, type } = params as any;

        expect(width).toBe(1920);
        expect(height).toBe(1080);
        expect(duration).toBeGreaterThan(5.5);
        expect(type).toBe('matroska,webm');

    }, 300000);

});