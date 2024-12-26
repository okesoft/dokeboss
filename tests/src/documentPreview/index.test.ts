import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/documentPreview/');
describe('document preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview docx from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '35a56534da0373ab9e1610b97b463ccac3f7cc5a8b0c699448b08f7a8e8b4627';
        const buffer = fs.readFileSync(path + 'document.docx');
        const outputFile = path + 'generated' + r + '.docx.jpg';
        let data = Buffer.from('');

        let hash = "";
        let mime = getDoku().getMimeTypeByExtention('docx');
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

    it('preview docx', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '35a56534da0373ab9e1610b97b463ccac3f7cc5a8b0c699448b08f7a8e8b4627';
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.docx.jpg';
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

    }, 25000);

    it('preview pdf', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'e6c8b1c953fe775d2aaa51749690ca5c7c8de1e3f59dbd21f26eb9ec3d941e43';
        const inputFile = path + 'document.pdf';
        const outputFile = path + 'generated' + r + '.pdf.jpg';
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

    }, 25000);

    it('preview doc', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '8ab5d8e072baa963c5b5ad83239dab416c6d271558bb05dfdaf7f3304263162b';
        const inputFile = path + 'document.doc';
        const outputFile = path + 'generated' + r + '.doc.jpg';
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

    }, 25000);

    it('preview xls', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '8ba04ea498766d76ebaa35008cb86a68afd60c9162a3ff4d076afcced6e32a46';
        const inputFile = path + 'document.xls';
        const outputFile = path + 'generated' + r + '.xls.jpg';
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

    }, 25000);

    it('preview xlsx', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'b494a6eb6018f674edf406274ea82d782e9af5f95f28ef215918ae224479fa84';
        const inputFile = path + 'document.xlsx';
        const outputFile = path + 'generated' + r + '.xlsx.jpg';
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

    }, 25000);

    it('preview csv', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'ef859bf9bfb74406c45c7a61dd6ac8478a74735812c1f67f0d1e0208d212e609';
        const inputFile = path + 'document.csv';
        const outputFile = path + 'generated' + r + '.csv.jpg';
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

    }, 25000);

    it('preview txt', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'b5f713b744ad0eb99b843c4da7630092f38a1c062bfef1b3f3cd3aa7ad7f69fe';
        const inputFile = path + 'document.txt';
        const outputFile = path + 'generated' + r + '.txt.jpg';
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

    }, 25000);

    it('preview psd', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'a116f70147e5af63b52700cb41d9f0cfe92995372d92707762f446135af08f4a';
        const inputFile = path + 'document.psd';
        const outputFile = path + 'generated' + r + '.psd.jpg';
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

    }, 25000);

});