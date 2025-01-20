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
            imageBlur: true,
            //quality: 0-100, quality of result image
            //imageBackground: 'white' //background of transpanent image to jpg (will add white background)
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
        .preview({ imageBlur: true });

//preview of video with crop image after
const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.webp', { width: 300 })
        .after('crop', { x: 0, y: 300, width: 300, height: 300 })
        .preview({ quality: 40 })       
```

also for videos is available check for streamable content (http 206):
```ts
//its also available with remote mode.
const flag = await dokeBoss.setRemote(true).isStreamable('video.mp4');
const flag = await dokeBoss.fromUrl("http://...").isStreamable();
const flag = await dokeBoss.from("../video.mov").isStreamable();
const flag = await dokeBoss.fromBuffer(Buffer.from('')).isStreamable();
```

for the video convertation also available next flags:
```ts
const data = await dokeBoss.from('./test.mov')
        .to('./preview_video.webp',{ 
                videoStreamable: true,//its make video streamable (move moov atoms to the start of the file. Its makes mp4 avvailable to stream with http protocol)
                videoWebmOptimized: true// its works only for webm files. Will make webm video more optimized with two pass ffmpeg analysis of file. (its slowly to convert)
          })
        .convert()    
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

**Remote api**

You can make remote convertation with rest api included in this package. Just run `node build/api.js` or `npm run serve` and add to invoke command:
important notice: .after, custom and callback modules as well as site preview to pdf is not working in remote mode.

Will throw error with message `remote is not available` in case api is not available (or timeout 1000 ms).

```typescript
try {
await getDoku()
        .setRemote(true)//also can be an url: https?://host:port. true mean will look in localhost:5001
        //.after and custom/callback modules is not applicable in remote mode yet
        .from(inputFile)
        .to(outputFile, { width: 300, height: 300 })
        .convert();
} catch(e) {
        if (e.message == 'remote is not available'){
                //api is not started.
        }
}
```

remote can be started with cli:
`npx dokeboss-api`

remote script have next env variables:
```
DOKEBOSS_API_HOST - host of server, default is 127.0.0.1
DOKEBOSS_API_PORT - port of server, default is 5001
DOKEBOSS_API_FILESIZE - max file size, default is 1024*1024*1024 bytes
DOKEBOSS_API_FILEUPLOAD_LOG - debug enabled/disabled, default is false
DOKEBOSS_API_FILEUPLOAD_LOG_FILE - debug log file, default '/tmp/fileupload.log'
DOKEBOSS_API_FILEUPLOAD_TIMEOUT - upload timeout, default is 120000 (120 sec)
```

also you can run remote script in docker with all depedencies:
```
//TODO docker run command
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

**before/after**
actually its just a alias for callback module, can be invoked before/after convertation/preview.

```typescript
data = await getDoku()
        .from(inputFile)
        .to(outputFile, { width: 300 })
        .before((options: any, mimeType: string) => async (_inputFile, _outputFile) => {
                const data = fs.readFileSync(inputFile);
                //do something with inputFile data and put to outPutFile as buffer or return buffer.
                //it will invoke before convertation chain
                return Buffer.from(data).reverse();
        })
        .preview();


data = await getDoku()
        .from(inputFile)
        .to(outputFile, { width: 300 })
        .after((options: any, mimeType: string) => async (_inputFile, _outputFile) => {
        const data = fs.readFileSync(inputFile);
                //do something with inputFile data and put to outPutFile as buffer or return buffer.
                //it will invoke after convertation chain
                return Buffer.from(data).reverse();
        })
        .preview();
```



**Special methods**
```typescript
const extention = dokeBoss.getExtensionByMimeType('image/jpeg')//will return jpg or false
const mime = dokeBoss.getMimeTypeByExtention('jpg')//will return image/jpg or false
dokeBoss.setDownloadTimeout(15000)//will set timeout for download from link to 15 seconds.
dokeBoss.setOperationTimeout(15000)//will set timeout for spawn operation (shell) globally for all modules.
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
- text/html
- doc
- docx
- xls
- xlsx
- txt
- csv
- psd

Can also make site preview, download file / text/html from url, make bulk convert/preview by glob and customizable by module system.

## installation

install ffmpeg with webm support, imagemagick (7+) with webp and HEIC support. And docker contrainer with unoserver
```
apt-get install ffmpeg imagemagick
docker run -p 2003:2003 ghcr.io/unoconv/unoserver-docker
```

## docker installation


## tests

`npx jest -i` from the root directory.