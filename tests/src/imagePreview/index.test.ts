import exp from 'constants';
import { getDoku, getByteHash, getImageDimentions, removeGenerated, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/imagePreview/');
describe('image preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview png from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const buffer = fs.readFileSync(path + 'image.png');
        const outputFile = path + 'generated' + r + '.png.jpg';
        let data = Buffer.from('');

        let mime = getDoku().getMimeTypeByExtention('png');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        let { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(578);
        expect(height).toEqual(537);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview of HEIC image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image1.HEIC';
        const outputFile = path + 'generated' + r + '.HEIC.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        let { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(169);
        expect(height).toEqual(300);
        expect(type).toEqual('webp');
    });

    it('preview of heic image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.heic';
        const outputFile = path + 'generated' + r + '.heic.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(200);
        expect(type).toEqual('webp');

    });

    it('preview of jpg image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.jpg';
        const outputFile = path + 'generated' + r + '.jpg.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(200);
        expect(type).toEqual('webp');


    });

    it('preview of png image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.png';
        const outputFile = path + 'generated' + r + '.png.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(279);
        expect(type).toEqual('webp');

    });

    it('preview of gif image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.gif';
        const outputFile = path + 'generated' + r + '.gif.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(300);
        expect(type).toEqual('webp');

    });

    it('preview of svg image to webp', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.svg';
        const outputFile = path + 'generated' + r + '.svg.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }


        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(300);
        expect(type).toEqual('webp');

    });

    it('preview of webp image to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.webp';
        const outputFile = path + 'generated' + r + '.webp.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(212);
        expect(height).toEqual(300);
        expect(type).toEqual('jpeg');

    });

    it('preview of big image to small jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'bigimage.png';
        const outputFile = path + 'generated' + r + '.small.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(169);
        expect(type).toEqual('jpeg');

    });

});