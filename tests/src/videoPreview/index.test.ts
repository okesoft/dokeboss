import { getDoku, getByteHash, removeGenerated, getImageDimentions, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/videoPreview/');
describe('video preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview mov to jpeg from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const buffer = fs.readFileSync(path + 'video.mov');
        const outputFile = path + 'generated' + r + '.mov.jpg';
        let data = Buffer.from('');

        let mime = getDoku().getMimeTypeByExtention('mov');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(1080);
        expect(height).toEqual(1920);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('crop after mov to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const buffer = fs.readFileSync(path + 'video.mov');
        const outputFile = path + 'generated' + r + '.crop.mov.jpg';
        let data = Buffer.from('');

        let mime = getDoku().getMimeTypeByExtention('mov');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .after('crop', { width: 1000, height: 300, x: 0, y: 500 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(1000);
        expect(height).toEqual(300);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview mov video to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.mov.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(1080);
        expect(height).toEqual(1920);
        expect(type).toEqual('jpeg');

    });

    it('preview mp4 video to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.mp4';
        const outputFile = path + 'generated' + r + '.mp4.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(1920);
        expect(height).toEqual(1080);
        expect(type).toEqual('jpeg');

    });

    it('preview webm video to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.webm';
        const outputFile = path + 'generated' + r + '.webm.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(1920);
        expect(height).toEqual(1080);
        expect(type).toEqual('jpeg');

    });

    it('preview webm video to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.webm';
        const outputFile = path + 'generated' + r + '.webm.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .after('preview', { width: 300, height: 300, mimeType: 'image/webp' })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(169);
        expect(type).toEqual('webp');

    });

});