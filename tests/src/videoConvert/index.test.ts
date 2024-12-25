import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';

const path = getPath('/videoConvert/');
describe('video convert', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('convert mov video to mp4', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'daa05731a30ea2ca70bef8c4b4ab27d5b2c55e800b2af68db38fbc1708c7fb1a';
        const inputFile = path + 'video.mov';
        const outputFile = path + 'generated' + r + '.mp4';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile)
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    }, 25000);

});