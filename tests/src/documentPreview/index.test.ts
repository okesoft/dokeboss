import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';

const path = getPath('/documentPreview/');
describe('document preview', () => {

    beforeAll(async () => {

        await removeGenerated(path);

    });

    it('preview docx', async () => {
        const r = parseInt("" + (Math.random() * 1000));
        const resultHash = '350357616448350d56a44fc9cefa368b5cea0e6e589a7a7672c5a135dd76015f';
        const inputFile = path + 'document.docx';
        const outputFile = path + 'generated' + r + '.jpg';
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