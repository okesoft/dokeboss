import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';

const path = getPath('/inputchecks/');
describe('input checks', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('input file not found', async () => {

        try {
            await getDoku().from(path + '1.png')
                .to(path + '1.jpg')
                .convert();
        } catch (e) {
            expect(e.message).toBe("inputFile not found");
        }

    });

    it('input mime type is unknow', async () => {

        try {
            await getDoku().from(path + 'file', 'homer/simpson')
                .to(path + '1.jpg')
                .convert();
        } catch (e) {
            expect(e.message).toBe("unrecognized mimeType");
        }

    });

    it('input mime type is unknow', async () => {

        try {
            await getDoku().from(path + 'file', 'homer/simpson')
                .to(path + '1.jpg')
                .convert();
        } catch (e) {
            expect(e.message).toBe("unrecognized mimeType");
        }

    });


    it('input file is not a file', async () => {

        try {
            await getDoku().from(path + 'directory', 'image/png')
                .to(path + '1.jpg')
                .convert();
        } catch (e) {
            expect(e.message).toBe("inputFile is not a file");
        }

    });


    it('output path is not set', async () => {

        try {
            await getDoku().from(path + 'image.png', 'image/png')
                .to('')
                .convert();
        } catch (e) {
            expect(e.message).toBe("pathToFile is required");
        }

    });

    it('output path is not writable', async () => {

        try {
            await getDoku().from(path + 'image.png', 'image/png')
                .to(path + 'directory', { mimeType: 'image/jpeg' })
                .convert();
        } catch (e) {
            expect(e.message).toBe("pathToFile is not writable");
        }

    });

    it('output mime type is unknow', async () => {

        try {
            await getDoku().from(path + 'image.png', 'image/png')
                .to(path + '2.xsdfs')
                .convert();
        } catch (e) {
            expect(e.message).toBe("unrecognized mimeType");
        }

    });


    it('output mime type (manual) is unknow', async () => {

        try {
            await getDoku().from(path + 'image.png', 'image/png')
                .to(path + '2', { mimeType: 'homer/simpson' })
                .convert();
        } catch (e) {
            expect(e.message).toBe("unrecognized mimeType");
        }

    });

    it('to Buffer mime type is not set', async () => {

        try {
            await getDoku().from(path + 'image.png', 'image/png')
                .toBuffer('')
                .convert();
        } catch (e) {
            expect(e.message).toBe("mimeType is required");
        }

    });


    it('to Buffer mime type is unknow', async () => {

        try {
            await getDoku().from(path + 'image.png', 'image/png')
                .toBuffer('homer/simpson')
                .convert();
        } catch (e) {
            expect(e.message).toBe("unrecognized mimeType");
        }
    });

    it('preview can be only in image mime type', async () => {

        try {
            await getDoku().from(path + 'image.png', 'image/png')
                .to(path + "generated", { mimeType: 'text/plain' })
                .preview();
        } catch (e) {
            expect(e.message).toBe("outputMimeType must be image");
        }
    });

    it('from url url not found', async () => {

        try {
            await getDoku().fromUrl('');
        } catch (e) {
            expect(e.message).toBe("url is required");
        }
    });

    it('from url url incorrect', async () => {

        try {
            await getDoku().fromUrl('incorrect url');
        } catch (e) {
            expect(e.message).toBe("url is not valid");
        }
    });

    it('from url url incorrect', async () => {

        try {
            await getDoku()
                .setDownloadTimeout(5000)
                .fromUrl('http://1.2.3/1.png')
                .toBuffer('image/jpeg')
                .convert();
        } catch (e) {
            expect(e.message).toBe("can not download file");
        }
    }, 10000);

    it('from  buffer buffer is required', async () => {

        try {
            await getDoku().fromBuffer(null as any, '');
        } catch (e) {
            expect(e.message).toBe("buffer is required");
        }
    });

    it('from  buffer mimeTyoe is required', async () => {

        try {
            await getDoku().fromBuffer(Buffer.from(''), '');
        } catch (e) {
            expect(e.message).toBe("mimeType is required");
        }
    });

});