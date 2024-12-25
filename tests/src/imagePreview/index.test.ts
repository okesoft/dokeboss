import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';

const path = getPath('/imagePreview/');
describe('image preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview of png image to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '4dbe2431bebfbca67139a2906cf235983e8b24c4d9102a17973a0af2b1a0d772';
        const inputFile = path + 'image.png';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .preview();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

});