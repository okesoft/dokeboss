import { getDoku, removeGenerated, getVideoDimentions, getPath } from '../globals';
import dokeBoss from '../../../src';


const path = getPath('/videoConvert/');

describe('webm streaming convert', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('video is not streamable', async () => {

        const flags = await dokeBoss.isStreamable(path + 'video.mp4');
        expect(flags).toBe(false);

    }, 10000);

    it('video is streamable', async () => {

        const flags = await dokeBoss.isStreamable(path + 'streamable.mp4');
        expect(flags).toBe(true);

    }, 10000);

    it('convert mp4 to mp4 with moov atoming', async () => {

        const r = parseInt("" + (Math.random() * 1000));
        const outputFile = path + 'generated' + r + '.mp4.to.streamable.mp4';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(path + 'video.mp4')
                .to(outputFile, { videoStreamable: true })
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const flags1 = await dokeBoss.isStreamable(path + 'video.mp4');
        expect(flags1).toBe(false);
        const flags = await dokeBoss.isStreamable(outputFile);
        expect(flags).toBe(true);

    }, 105000);

    it('convert mp4 to webm for http 206 streaming (optimal with 2 step ffmpeg converting)', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const outputFile = path + 'generated' + r + '.mp4.to.optimized.webm';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(path + 'video.mp4')
                .to(outputFile, { videoStreamable: true, videoWebmOptimized: true })
                .convert();
        } catch (e) {
            console.log('error', e)
        }


        let params = {};
        params = await getVideoDimentions(outputFile);

        const { width, height, duration, type } = params as any;
        expect(width).toBe(1920);
        expect(height).toBe(1080);
        expect(duration).toBeGreaterThan(5);
        expect(type).toBe('matroska,webm');
        //i dont know how to check if its really optimized. I can only check if its webm and has some dimensions

    }, 300000);

});