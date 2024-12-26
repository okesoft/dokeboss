import dokeBoss from '../../../src';
import { getDoku, getByteHash, removeGenerated, getPath } from '../globals';
import fs from 'fs';

const path = getPath('/bulkConvert/');
describe('bulk images convert', () => {

    beforeAll(async () => {

        await removeGenerated(path + 'images/');

    });

    it('bulk convert jpg images to webp', async () => {
        const map = {
            '1.jpg': 150000,
            '2.jpg': 150000,
            '3.jpg': 200000,
            '4.jpg': 170000,
            '5.jpg': 90000,
        }
        const r = parseInt("" + (Math.random() * 1000));

        let data: dokeBoss[] = [];

        try {
            data = await getDoku().bulk('preview', path + 'images/*.jpg', path + 'images/generated-{name}-' + r + '.webp', { width: 500, height: 500 }, (ob) => {
                //do something with the object before convert/preivew operation
            })
        } catch (e) {
            console.error('error', e)
        }

        expect(data.length).toEqual(5);

        for (let i in data) {
            let name = data[i].getOriginalFileName().toString().split('/').pop();
            let filename = data[i].getOutputFileName().toString().split('/').pop();

            const stat = fs.lstatSync(path + 'images/' + filename);
            expect(stat.size).toBeGreaterThan(map[name || '']);
            expect(stat.size).toBeLessThan(map[name || ''] * 1.5);
            expect(stat.isFile()).toEqual(true);
        }


    }, 25000);


});