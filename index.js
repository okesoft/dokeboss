const dokeBoss = require('./build/index').default;
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
    /*const data = await dokeBoss.from('./test.png')
        .to('./preview.jpg', { width: 300, height: 300 })
        .preview()*/

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

    console.log(data);
}


main();

