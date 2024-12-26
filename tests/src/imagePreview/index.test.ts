import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/imagePreview/');
describe('image preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview png from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '55ee2c4398387863d9f2f8c9902b1a56d6dbd909e529208237967ce8681c2d1d';
        const buffer = fs.readFileSync(path + 'image.png');
        const outputFile = path + 'generated' + r + '.png.jpg';
        let data = Buffer.from('');

        let hash = "";
        let mime = getDoku().getMimeTypeByExtention('png');
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

    it('preview of HEIC image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '2c21e7939c2e280dd6981cbc5794bd99b1cc6555dea33b21adf33d29f197096f';
        const inputFile = path + 'image1.HEIC';
        const outputFile = path + 'generated' + r + '.HEIC.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview of heic image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'c12a60b1121ab87d6b051a1e885c59b78a9766fbe449c5326b92299e14a48dd0';
        const inputFile = path + 'image.heic';
        const outputFile = path + 'generated' + r + '.heic.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview of jpg image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '8455de3f9e8e1f1d49567ebf87db1d7bc31f6f7d71b235363481105001c3988f';
        const inputFile = path + 'image.jpg';
        const outputFile = path + 'generated' + r + '.jpg.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview of png image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '52923b7fb4bf352ad6064ac1f7431b9a5f91e434110ca304abf67c035707c9b9';
        const inputFile = path + 'image.png';
        const outputFile = path + 'generated' + r + '.png.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview of gif image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '539d07c66f2a8061e61cad39ac69a4edb88c1b5c39a784ac996aa0644f9fd18d';
        const inputFile = path + 'image.gif';
        const outputFile = path + 'generated' + r + '.gif.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview of svg image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '0651e2de2706d44b385c37f2b1ddb75562ff1c7d8142395c20f8d9f56756d823';
        const inputFile = path + 'image.svg';
        const outputFile = path + 'generated' + r + '.svg.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('preview of webp image to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'f630ac9d1a27e9253045714d91b39cb1ba1385c3e6fef940150afb601a17c044';
        const inputFile = path + 'image.webp';
        const outputFile = path + 'generated' + r + '.webp.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

});