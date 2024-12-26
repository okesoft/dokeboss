const dokeBoss = require('./build/index').default;
const dokeBossBase = dokeBoss.dokeBossBase;

/*
dokeBoss.from('path/to/your/file.docx')
    .to('path/to/your/output', { width: 300, height: 300 })
    .preview()

dokeBoss
    .fromBuffer(buffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    .toBuffer('image/png', { width: 300, height: 300 })
    .preview()
*/

async function main() {
    const data = await dokeBoss.from('./test.png')
        .to('./preview.jpg', { width: 300, height: 300 })
        .preview()

    /*const data = await dokeBoss.from('./test.png')
        .to('./test2.jpg')
        .convert()*/

    /*const data = await dokeBoss.from('./test.png')
        .to('./preview.jpg', { width: 300, height: 300 })
        .preview({ blur: true })*/

    /*const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.jpg', { width: 300 })
        .preview()*/

    /*
    const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.webm')
        .convert()*/

    /*const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.jpg', { width: 300, height: 600, videoForceAspect: true })
        .preview({ blur: true })*/

    /*const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.webp', { width: 300 })
        .after('crop', { x: 0, y: 300, width: 300, height: 300 })
        .preview({ quality: 40 })*/

    /*
    const data = await dokeBoss.from('./test.docx')
        .to('./test_doc.jpg', { width: 300 })
        .preview()*/

    /*const data = await dokeBoss.from('./test.docx')
        .to('./test_conv.doc', { width: 300 })
        .convert()*/

    /*
    const data = await dokeBoss.from("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
        .to('./dummy_page.jpg')
        .preview()*/

    /*const data = await dokeBoss.from("https://google.com")
        .to('./page_1.jpg', { width: 300 })
        .preview()*/
    /*const data = await dokeBoss.from("https://twitch.tv")
        .to('./page.docx')
        .convert()*/

    /*
    const data = await dokeBoss.bulk('preview', '*.jpg', '*.png', { width: 300, height: 300 }, (ob) => {
        //do something with the object before convert/preivew operation
    })*/

    /*
    const data = await dokeBoss
        .addModule({
            on: 'after',//before default modules or after, onlu for callback
            mode: 'remove',
            mimeType: /.*'/,
            callback: (inputFile, outputFile) => {
                console.log('remove callback-module triggered')
                return Buffer.from('');
            }
        })
        .from('./test.png')
        .to('./test2.jpg')
        .convert();
        */
    //(data);

}


main();

