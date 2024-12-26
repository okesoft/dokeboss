import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/videoPreview/');
describe('video preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview mov to jpeg from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'aacd287b1c3cb8b8bf3ac3c6c36653884a8a85e0fa3a46e592828ef181c22f4a';
        const buffer = fs.readFileSync(path + 'video.mov');
        const outputFile = path + 'generated' + r + '.mov.jpg';
        let data = Buffer.from('');

        let hash = "";
        let mime = getDoku().getMimeTypeByExtention('mov');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    }, 25000);

    it('crop after mov to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '1aa6eb784ea3ed279d02376c2a0d1dd1736e918687d0f4268564d2e9ee63ffa4';
        const buffer = fs.readFileSync(path + 'video.mov');
        const outputFile = path + 'generated' + r + '.crop.mov.jpg';
        let data = Buffer.from('');

        let hash = "";
        let mime = getDoku().getMimeTypeByExtention('mov');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .after('crop', { width: 1000, height: 300, x: 0, y: 500 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    }, 25000);

    it('preview mov video to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'aacd287b1c3cb8b8bf3ac3c6c36653884a8a85e0fa3a46e592828ef181c22f4a';
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.mov.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview mp4 video to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'b0c2b89b92ddb686d4ad2339b03d2befc2cf7a74082a4863ded78f04450121ff';
        const inputFile = path + 'video.mp4';
        const outputFile = path + 'generated' + r + '.mp4.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview webm video to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '3b1f53f730f4967f1b2eb51d214b27c5fe50a182b37eb3706a905e6607a9cc33';
        const inputFile = path + 'video.webm';
        const outputFile = path + 'generated' + r + '.webm.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview webm video to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '1892523225908d88cab2a183603c04f9c9ca3a616490a8a044b0dba108ffc3e0';
        const inputFile = path + 'video.webm';
        const outputFile = path + 'generated' + r + '.webm.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .after('preview', { width: 300, height: 300, mimeType: 'image/webp' })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

});