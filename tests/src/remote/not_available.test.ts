import { getDoku, getByteHash, removeGenerated, getImageDimentions, getVideoDimentions, getPath } from '../globals';
import fs from 'fs';
const path = getPath('/remote/');
describe('remote: tests remote is not started', () => {


    it('not-remote: convert png from buffer', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const buffer = fs.readFileSync(path + 'image.png');
        const outputFile = path + 'generated' + r + '.png.jpg';
        let data = Buffer.from('');

        let mime = getDoku().getMimeTypeByExtention('png');
        try {
            data = await getDoku()
                .setRemote(true)
                .from(buffer, mime ? mime : '')
                .to(outputFile)
                .convert();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }


    }, 1500);


    it('not-remote: convert png image to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.png';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .convert();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);

    it('not-remote: preview jpg image to jpeg (less size)', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.jpg';
        const outputFile = path + 'generated' + r + '.jpg.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku()
                .setRemote(true)
                .from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);
    //preview video
    it('not-remote: preview mov video to jpg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku()
                .setRemote(true)
                .from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);

    it('not-remote: download pdf document to jpg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        const outputFile = path + 'generated' + r + '.download.pdf.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku()
                .setRemote(true)
                .from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);

    //preview document
    it('not-remote: preview docx document to jpg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku()
                .setRemote(true)
                .from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);
    //convert document
    it('not-remote: convert docx document to pdf', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.pdf';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku()
                .setOperationTimeout(120000)
                .setRemote(true)
                .from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .convert();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);

    it('not-remote: html page preview', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '';
        const inputFile = 'https://www.google.com';
        const outputFile = path + 'generated' + r + '.url.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku()
                .setRemote(true)
                .from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);

    it('not-remote: isStreamable:false', async () => {
        const buffer = fs.readFileSync(path + '../videoConvert/video.mp4');
        let mime = getDoku().getMimeTypeByExtention('mp4');
        let res: boolean | null = null;
        try {
            res = await getDoku()
                .setRemote(true)
                .from(buffer, mime ? mime : '')
                .isStreamable();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);

    it('not-remote: isStreamable:true', async () => {
        const buffer = fs.readFileSync(path + '../videoConvert/streamable.mp4');
        let mime = getDoku().getMimeTypeByExtention('mp4');
        let res: boolean | null = null;
        try {
            res = await getDoku()
                .setRemote(true)
                .from(buffer, mime ? mime : '')
                .isStreamable();
        } catch (e) {
            expect(e.message).toBe("remote is not available");
        }

    }, 1500);

});