import { getDoku, getByteHash, removeGenerated, getImageDimentions, getVideoDimentions, getPath } from '../globals';
import fs from 'fs';
const spawn = require('await-spawn');

let prc;
const path = getPath('/remote/');
describe('remote: tests', () => {

    beforeAll(async () => {

        await new Promise(async resolve => {
            console.log('start api process')
            //no await here
            prc = spawn("node", ["./build/api.js"]);
            console.log(`Spawned child pid: ${prc.child.pid}`);
            prc.catch(async e => {
                console.log('error', e.stderr?.toString() ?? e.message);
                try {
                    await spawn('kill', ['-9', prc.child.pid]);
                } catch (e) {

                }
            })
            await removeGenerated(path);

            setTimeout(() => {
                resolve(true);
            }, 4000)

        })

    });

    afterAll(async () => {
        if (prc && prc.child) {
            console.log('kill api process')
            prc.child.kill('SIGINT');
        }
    })

    it('remote: convert png from buffer', async () => {
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
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(578);
        expect(height).toEqual(537);
        expect(type).toEqual('jpeg');

    }, 25000);


    it('remote: convert png image to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const inputFile = path + 'image.png';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(578);
        expect(height).toEqual(537);
        expect(type).toEqual('jpeg');

    });

    it('remote: preview jpg image to jpeg (less size)', async () => {
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
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(169);
        expect(type).toEqual('jpeg');

    });
    //preview video
    it('remote: preview mov video to jpg', async () => {
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
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(300);
        expect(height).toEqual(300);
        expect(type).toEqual('jpeg');

    });
    it('remote: convert mov video to webm', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.webm';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku()
                .setOperationTimeout(300000)
                .setRemote(true)
                .from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        let params = {};
        params = await getVideoDimentions(outputFile);
        console.log(1, params);
        const { width, height, duration, type } = params as any;
        expect(width).toBe(1920);
        expect(height).toBe(1080);
        expect(duration).toBeGreaterThan(25);
        expect(type).toBe('matroska,webm');

    }, 300000);

    it('remote: download pdf document to jpg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '629e3b45dd03e90e4d06b02ddde01552a470bc6afbc5c56f118a4a766a6124f7';
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
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 25000);

    //preview document
    it('remote: preview docx document to jpg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '35a56534da0373ab9e1610b97b463ccac3f7cc5a8b0c699448b08f7a8e8b4627';
        const inputFile = path + 'document.docx';
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
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(612);
        expect(height).toEqual(792);
        expect(type).toEqual('jpeg');

    }, 125000);
    //convert document
    it('remote: convert docx document to pdf', async () => {
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
            console.log('error', e)
        }

        const stat = fs.lstatSync(outputFile);
        expect(stat.size).toBeGreaterThan(50000);
        expect(stat.isFile()).toEqual(true);

    }, 125000);

    it('remote: html page preview', async () => {
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
            console.log('error', e)
        }

        //image can be different because of duddles
        const stat = fs.lstatSync(outputFile);
        expect(stat.size).toBeGreaterThan(50000);
        expect(stat.isFile()).toEqual(true);

    }, 25000);

});