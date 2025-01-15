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
        const resultHash2 = 'cadcfd1b24ace05642b839ffea7419fe2a7066273fde2a3ab583f5b1194dee59';
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
                .preview();

        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash2);
    });

    it('check callback modules (before)', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');
        const inputFileData = fs.readFileSync(inputFile);
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
                .preview();

        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);
    });

});