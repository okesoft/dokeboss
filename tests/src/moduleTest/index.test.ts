import { getDoku, getByteHash, removeGenerated, getImageDimentions, getPath } from '../globals';
import fs from 'fs';
const path = getPath('/moduleTest/');
describe('modules test', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('check crop module after preview', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .after('crop', { x: 10, y: 0, width: 300, height: 200 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(200);
        expect(type).toEqual('jpeg');

    });

    it('check callback modules (after)', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash1 = '350357616448350d56a44fc9cefa368b5cea0e6e589a7a7672c5a135dd76015f';
        const resultHash2 = 'c6ee093e8a90dfe536affeb866c6f9e9e71729f0c0a78805dd8789a11bc9a4f9';
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku()
                .addModule({
                    on: 'after',//before default modules or after, only for callback
                    mode: 'remove' as any,
                    mimeType: /.*/,
                    callback: (options: any, mimeType: string) => async (inputFile, outputFile) => {
                        const data = fs.readFileSync(inputFile);

                        hash = await getByteHash(data);
                        //expect(hash).toEqual(resultHash1);

                        return Buffer.from(data).reverse();
                    }
                })
                .from(inputFile)
                .to(outputFile)
                .convert();

        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash2);
    });

    it('check callback modules (before)', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'f3e2b33436a036befb64ae83a03543c1c0c31cb8f771d45f939ce910a067e6d7';
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');
        const inputFileData = fs.readFileSync(inputFile);
        const inputDataHash = await getByteHash(inputFileData);
        //console.log('data1: ', inputDataHash, inputFileData)

        let hash = "";
        try {
            data = await getDoku()
                .addModule({
                    on: 'before',//before default modules or after, only for callback
                    mode: 'remove' as any,
                    mimeType: /.*/,
                    callback: (options: any, mimeType: string) => async (inputFile, outputFile) => {
                        const data = fs.readFileSync(inputFile);
                        hash = await getByteHash(data);
                        //console.log('data2: ', hash, data)
                        expect(data).toEqual(inputFileData);
                        return data;
                    }
                })
                .from(inputFile)
                .to(outputFile)
                .convert();

        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);
    });

});