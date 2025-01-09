import { getDoku, getByteHash, removeGenerated, getPath, getImageDimentions } from '../globals';

const path = getPath('/fromUrl/');
describe('document from url', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview pdf from url', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        try {
            data = await getDoku().from("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
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

    it('image from url', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const outputFile = path + 'generated' + r + '.webp';
        let data = Buffer.from('');

        try {
            data = await getDoku().from("https://memepedia.ru/wp-content/uploads/2016/03/large_p19d7nh1hm1i37tnuim11ebqo5c1.jpg")
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        const { width, height, type } = await getImageDimentions(outputFile);
        expect(width).toEqual(604);
        expect(height).toEqual(512);
        expect(type).toEqual('webp');

    }, 25000);

});