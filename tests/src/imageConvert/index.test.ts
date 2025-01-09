import { getDoku, getByteHash, removeGenerated, getPath, getImageDimentions, } from '../globals';
import fs from 'fs';

const path = getPath('/imageConvert/');
describe('image convert', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('convert png from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'ee7b9585be16946d39c62e600a7c18dfefdbf641e900b5921d4b7d749724eed5';
        const buffer = fs.readFileSync(path + 'image.png');
        const outputFile = path + 'generated' + r + '.png.jpg';
        let data = Buffer.from('');

        let hash = "";
        let mime = getDoku().getMimeTypeByExtention('png');
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


    it('convert png image to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'ee7b9585be16946d39c62e600a7c18dfefdbf641e900b5921d4b7d749724eed5';
        const inputFile = path + 'image.png';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

    it('convert of big image png to cropped jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'bigimage.png';
        const outputFile = path + 'generated' + r + '.cropped.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .after('crop', { x: 2000, y: 2000, width: 1000, height: 1000 })
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(1000);
        expect(height).toEqual(1000);
        expect(type).toEqual('jpeg');

    });

});