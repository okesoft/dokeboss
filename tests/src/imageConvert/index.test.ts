import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';

const path = getPath('/imageConvert/');
describe('image convert', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('convert png image to jpeg', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = 'ee7b9585be16946d39c62e600a7c18dfefdbf641e900b5921d4b7d749724eed5';
        const inputFile = path + 'image.png';
        const outputFile = path + 'generated' + r + '.jpg';
        let data = Buffer.from('');

        let hash = "";
        try {
            data = await getDoku().from(inputFile)
                .to(outputFile, { width: 300, height: 300 })
                .convert();
        } catch (e) {
            console.log('error', e)
        }

        hash = await getByteHash(data);
        expect(hash).toEqual(resultHash);

    });

});