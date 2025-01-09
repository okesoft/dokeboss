import { getDoku, getByteHash, removeGenerated, getImageDimentions, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/documentPreview/');
describe('document preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview docx from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const buffer = fs.readFileSync(path + 'document.docx');
        const outputFile = path + 'generated' + r + '.docx.jpg';
        let data = Buffer.from('');

        let mime = getDoku().getMimeTypeByExtention('docx');
        try {
            data = await getDoku().from(buffer, mime ? mime : '')
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview docx', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.docx.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview pdf', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.pdf';
        const outputFile = path + 'generated' + r + '.pdf.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview doc', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.doc';
        const outputFile = path + 'generated' + r + '.doc.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview xls', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.xls';
        const outputFile = path + 'generated' + r + '.xls.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview xlsx', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.xlsx';
        const outputFile = path + 'generated' + r + '.xlsx.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview csv', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.csv';
        const outputFile = path + 'generated' + r + '.csv.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview txt', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.txt';
        const outputFile = path + 'generated' + r + '.txt.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    it('preview psd', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.psd';
        const outputFile = path + 'generated' + r + '.psd.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(1100);
        expect(height).toEqual(770);
        expect(type).toEqual('jpeg');

    }, 25000);

});