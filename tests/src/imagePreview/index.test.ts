import { getDoku, getByteHash } from '../globals';

it('preview of png image to jpeg', async () => {

    const inputFile = './image.png';
    const outputFile = './generated.jpg';

    const data = await getDoku().from(inputFile)
        .to(outputFile, { width: 300, height: 300 })
        .preview();

    const hash = await getByteHash(data);
    console.log(hash);
    expect(hash).toEqual('');

});