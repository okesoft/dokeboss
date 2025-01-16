import dokeBoss from '../../../src';
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
        const outputFile = path + 'generated' + r + '.cropped.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
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

    it('check crop module after preview and resize', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.resized.cropped.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 200 })
                .after('crop', { x: 10, y: 50, width: 100, height: 100 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(100);
        expect(height).toEqual(100);
        expect(type).toEqual('jpeg');

    });

    it('check callback modules:after', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash2 = 'cadcfd1b24ace05642b839ffea7419fe2a7066273fde2a3ab583f5b1194dee59';
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.after.jpg';
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
            //console.log('error', e)
        }
        dokeBoss.unloadModules();

        //keep this because its reversed buffer of image.
        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash2);
    }, 25000);


    it('check callback modules:after instance', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.after-2.jpg';
        let data = Buffer.from('');

        data = await getDoku()
            .from(inputFile)
            .to(outputFile)
            .after((options: any, mimeType: string) => async (_inputFile, _outputFile) => {
                const d = fs.readFileSync(inputFile);
                return Buffer.from(d).reverse();
            })
            .preview();

        const resultHash2 = 'f3e2b33436a036befb64ae83a03543c1c0c31cb8f771d45f939ce910a067e6d7';
        let hash = await getByteHash(data);
        expect(hash).toEqual(resultHash2);

    }, 50000);

    it('check callback modules:before', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.before.jpg';
        let data = Buffer.from('');
        const inputFileData = fs.readFileSync(inputFile);


        data = await getDoku()
            .addModule({
                on: 'before',//before default modules or after, only for callback
                mode: 'remove' as any,
                mimeType: /.*/,
                callback: (options: any, mimeType: string) => async (_inputFile, _outputFile) => {
                    const raw_input = fs.readFileSync(_inputFile);
                    expect(raw_input).toEqual(inputFileData);
                    return raw_input;
                }
            })
            .from(inputFile)
            .to(outputFile, { width: 300 })
            .preview();

        dokeBoss.unloadModules();

        let { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(388);
        expect(type).toEqual('jpeg');

    }, 50000);

    it('check callback modules:before instance', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.before-2.jpg';
        let data = Buffer.from('');
        const inputFileData = fs.readFileSync(inputFile);


        data = await getDoku()
            .from(inputFile)
            .to(outputFile, { width: 300 })
            .before((options: any, mimeType: string) => async (_inputFile, _outputFile) => {
                const raw_input = fs.readFileSync(_inputFile);
                expect(raw_input).toEqual(inputFileData);
                return raw_input;
            })
            .preview();

        let { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(388);
        expect(type).toEqual('jpeg');

    }, 50000);

});