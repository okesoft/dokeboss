# dokeboss
Image preview from all types of documents. 

## examples

**Basic**
```typescript 
//from file path to file path
const buffer = dokeBoss.from('path/to/your/file.docx')
    .to('path/to/your/output', { width: 300, height: 300 })
    .preview()

//from buffer and to buffer
const buffer2 = dokeBoss
    .fromBuffer(buffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    .toBuffer('image/png', { width: 300, height: 300 })
    .preview();

//this can also been combinied from buffer -> to file, from file -> to buffer.
```

**Images**

```typescript
//basic convert from png to jpg
const data = await dokeBoss.from('./test.png')
        .to('./test2.jpg')
        .convert();

//with blur
const data = await dokeBoss.from('./test.png')
        .to('./preview.jpg', { width: 300, height: 300 })
        .preview({ 
            blur: true,
            //quality: 0-100, quality of result image
            //background: 'white' //background of transpanent image to jpg (will add white background)
        })       
```

**Videos**

```typescript 
//convert video to video
const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.webm')
        .convert()

//preview of video with blur filter
const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.jpg', { width: 300, height: 600, videoForceAspect: true })
        .preview({ blur: true });

//preview of video with crop image after
const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.webp', { width: 300 })
        .after('crop', { x: 0, y: 300, width: 300, height: 300 })
        .preview({ quality: 40 })       
```

**Documents**

```typescript
//preview of document
const data = await dokeBoss.from('./test.docx')
    .to('./test_doc.jpg', { width: 300 })
    .preview();

//convert document to pdf
const data = await dokeBoss.from('./test.docx')
        .to('./test_conv.pdf')
        .convert();
```

**from url**
```typescript
//you can also download file from url and work with it later
const data = await dokeBoss.from("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
        .to('./dummy_page.jpg')
        .preview()

const data = await dokeBoss.fromUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
        .to('./dummy_page.jpg')
        .preview();
        
        
//by default it will check mime type by end of url (extention of file) and if extention is not found mime will be text/html
//but you can add mimeType
const data = await dokeBoss.from("https://site.com/filenoextention", 'image/jpg')
```

**site preview**
```typescript
//if mimeType is text/html - you can use preview on it also.
//it will generate image of site. 
const data = await dokeBoss.from("https://google.com")
        .to('./page_1.jpg', { width: 300 })
        .preview();

//Its not tested, but also convert to pdf will works. because text/html flow is html->pdf->image
const data = await dokeBoss.from("https://google.com")
        .to('./page.pdf')
        .convert();       
```

**BulkPreview**

```typescript
const data = await dokeBoss.bulk('preview', '*.jpg', '{name}.png', { width: 300, height: 300 }, (ob) => {
        //do something with the object before convert/preivew operation
        //for example you can add 
        //obj.after('crop', {width: 300, height: 300, x: 0, y:100});
        //or you own module
})
```

**callbacks modules**

```typescript
//add own callback modules before or after convert/preview
const data = await dokeBoss
        .addModule({
            on: 'after',//before default modules or after, only for callback
            mode: 'remove',//can be anything
            mimeType: /.*/,//regexp
            callback: (options: any, mimeType:string)=>(inputFile, outputFile) => {
                //in case of after - inputFile will contain data after convert operation, so it will ge jpg bytes and convert operation will return bytes from this callback.
                //otherwise - before will able to call - before convert operation and return from this callback will sended to start of convert operation
                console.log('remove callback-module triggered')
                //here you can do something with inputTempFile and outputTemp file
                //also can return buffer or
                return Buffer.from('');

                //special structure dokeBossModuleCmd
                return { command: 'magick', [inputFile,'-param1','-param2', outputFile], timeout?: 15000 }//will await-spawn this command to console
            }
        })
        .from('./test.png')
        .to('./test2.jpg')
        .convert();
```

**Special methods**
```typescript
const extention = dokeBoss.getExtensionByMimeType('image/jpeg')//will return jpg or false
const mime = dokeBoss.getMimeTypeByExtention('jpg')//will return image/jpg or false
dokeBoss.setDownloadTimeout(15000)//will set timeout for download from link to 15 seconds.
```

## coverage

Now implemented and tested next types of documents (both convert and preview):


**Images**
- image/jpeg
- image/gif
- image/png
- image/psd
- image/svg
- image/webp
- image/heic

**Video**

- video/mov
- video/webm
- video/mp4

**Documents**

- application/pdf
- doc
- docx
- xls
- xlsx
- txt
- csv
- psd

Can also make site preview, download file / text/html from url, make bulk convert/preview by glob and customizable by module system.

## installation

install ffmpeg, imagemagick and docker contrainer with unoserver
```
apt-get install ffmpeg imagemagick
docker run -p 2003:2003 ghcr.io/unoconv/unoserver-docker
```