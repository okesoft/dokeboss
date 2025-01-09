import exp from 'constants';
import { getDoku, getByteHash, removeGenerated, getPath, getImageDimentions } from '../globals';
import fs from 'fs';

const path = getPath('/documentConvert/');
describe('document convert', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('convert from buffer docx doc to pdf', async () => {
        const r = parseInt("" + (Math.random() * 1000));

        const buffer = fs.readFileSync(path + 'document.docx');
        const outputFile = path + 'generated' + r + '.pdf';
        let data = Buffer.from('');

        let hash = "";
        let mime = getDoku().getMimeTypeByExtention('docx');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const stat = fs.lstatSync(outputFile);
        expect(stat.size).toBeGreaterThan(1000);
        expect(stat.size).toEqual(71784);//im not sure if this is the correct parameter to check
        expect(stat.isFile()).toEqual(true);
    });

    it('convert docx doc to pdf', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '';//converter returns different hashes

        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.pdf';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const stat = fs.lstatSync(outputFile);
        expect(stat.size).toBeGreaterThan(1000);
        expect(stat.size).toEqual(71784);//im not sure if this is the correct parameter to check
        expect(stat.isFile()).toEqual(true);

    });

});