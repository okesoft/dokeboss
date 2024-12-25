import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';

const path = getPath('/fromUrl/');
describe('document from url', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview pdf from url', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'ea036aa2fcbd04efe057ef5aa1d594dae7eaf6485fba0172ce743e5997695b7e';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    }, 25000);

    it('image from url', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '84b547f144eb1e9d54ac57d235d80be7269893912fdce3d3317c346e75ae4872';
        const outputFile = path + 'generated' + r + '.webp';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from("https://memepedia.ru/wp-content/uploads/2016/03/large_p19d7nh1hm1i37tnuim11ebqo5c1.jpg")
                .to(outputFile)
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    }, 25000);

});