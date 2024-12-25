import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';

const path = getPath('/videoPreview/');
describe('video preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview mov video to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'aacd287b1c3cb8b8bf3ac3c6c36653884a8a85e0fa3a46e592828ef181c22f4a';
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.jpg';
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

    });

});