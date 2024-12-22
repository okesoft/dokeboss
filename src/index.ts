import { tmpdir } from 'os';
import fs from 'fs';
import { join } from 'node:path';
import db from './db';
import dokeBossBase, { dokeBossModuleList } from './base';

export type dokeBossMode = 'preview' | 'convert' | 'crop';
export type dokeBossOptions = {
    imageAutorotate?: boolean;
    imageBackground?: any;
    imageBlur?: boolean;
    //
    videoForceAspect?: boolean;
    //
    width?: number,
    height?: number,
    quality?: number,
}

export default class dokeBoss extends dokeBossBase {
    protected session: string = '';
    protected inputTemp: boolean = false;
    protected outputTemp: boolean = false;
    protected mode: dokeBossMode = 'preview';

    protected inputFileName = '';
    protected inputMimeType = '';
    protected outputFileName = '';
    protected outputMimeType = 'image/jpeg';

    //for preview only
    protected outputWidth = 0;
    protected outputHeight = 0;
    protected outputQuality = 100;
    protected outputImageAutorotate: any;
    protected outputImageBackground: string;
    protected outputImageBlur: any;
    protected outputVideoForceAspect: boolean = false;

    constructor(fileName: string | Buffer, mimeType: string, modules: dokeBossModuleList[] = []) {
        super(modules);

        if (!this.session)
            this.session = fs.mkdtempSync(join(tmpdir(), 'dokuboss-'));

        this.addModule({
            mimeType: /image\/.*/,
            mode: 'preview',
            file: './modules/preview/image'
        });
        this.addModule({
            mimeType: /image\/.*/,
            mode: 'convert',
            file: './modules/convert/image'
        });
        this.addModule({
            mimeType: /image\/.*/,
            mode: 'crop',
            file: './modules/crop/image'
        });

        this.addModule({
            mimeType: /video\/.*/,
            mode: 'preview',
            file: './modules/preview/video'
        });
        this.addModule({
            mimeType: /video\/.*/,
            mode: 'convert',
            file: './modules/convert/video'
        });

        this.addModule({
            mimeType: /^(?!image)(?!video).+\/.+$/,
            mode: 'preview',
            file: './modules/preview/document'
        });
        this.addModule({
            mimeType: /^(?!image)(?!video).+\/.+$/,
            mode: 'convert',
            file: './modules/convert/document'
        });

        //todo: links

        if (!fileName) {
            throw new Error('fileName is required');
        }

        if (!mimeType) {
            throw new Error('mimeType is required');
        }

        const ext = dokeBoss.getExtensionByMimeType(mimeType)
        if (!ext) {
            throw new Error('unrecognized mimeType');
        }

        this.inputMimeType = mimeType;

        if (fileName instanceof Buffer) {
            this.inputTemp = true;
            this.inputFileName = this._createTempFileName(this.inputMimeType);
            fs.writeFileSync(this.inputFileName, fileName, { flag: 'w', encoding: 'binary' });
        } else if (typeof fileName == 'string') {
            this.inputFileName = fileName;
            if (!fs.existsSync(fileName))
                throw new Error('inputFile not found');

            const stats = fs.lstatSync(fileName);
            if (!stats.isFile()) {
                throw new Error('inputFile is not a file');
            }
        }

    }
    to(pathToFile: string, options: dokeBossOptions & { mimeType?: string } = {}): dokeBoss {

        if (!options)
            options = {};

        if (!pathToFile)
            throw new Error('pathToFile is required');

        try {
            fs.writeFileSync(pathToFile, "", { flag: 'w', encoding: 'binary' });
            this.outputFileName = pathToFile;
        } catch (e) {
            console.error(e)
            throw new Error('pathToFile is not writable');
        }

        if (!options.mimeType) {
            const mime = dokeBoss.getMimeTypeByExtention(pathToFile);
            if (mime) {
                options.mimeType = mime;
                this.outputMimeType = mime;
            } else {
                throw new Error('unrecognized mimeType');
            }
        }

        const ext = dokeBoss.getExtensionByMimeType(options.mimeType);
        if (!ext)
            throw new Error('unrecognized mimeType');

        this.setOptions(options);

        return this;
    }
    toBuffer(mimeType: string, options: dokeBossOptions): dokeBoss {
        if (!mimeType)
            throw new Error('mimeType is required');

        const ext = dokeBoss.getExtensionByMimeType(mimeType);
        if (!ext)
            throw new Error('unrecognized mimeType');

        this.setOptions(options);

        this.outputTemp = true;
        this.outputFileName = this._createTempFileName(mimeType);

        return this;
    }
    setOptions(options: dokeBossOptions = {}): dokeBoss {
        if (!options)
            options = {};

        if (options.width)
            this.outputWidth = options.width;
        if (options.height)
            this.outputHeight = options.height;
        if (options.quality)
            this.outputQuality = options.quality;

        this.outputImageAutorotate = options.imageAutorotate ?? false;

        if (options.imageBackground)
            this.outputImageBackground = options.imageBackground;

        if (options.videoForceAspect)
            this.outputVideoForceAspect = options.videoForceAspect;

        this.outputImageBlur = options.imageBlur ?? false;

        /* TODO: video to 10s gif preview
        if (options.videoGifDuration) {
            this.outputVideoGifDuration = options.videoGifDuration;
        }

        if (options.videoGif) {
            this.outputVideoGif = options.videoGif;
        }*/

        return this;

    }
    public getSession() {
        return this.session;
    }
    public getSrcMimeType() {
        return this.inputMimeType;
    }
    public getDestMimeType() {
        return this.outputMimeType;
    }
    public getOptions(): dokeBossOptions {
        return {
            width: this.outputWidth,
            height: this.outputHeight,
            quality: this.outputQuality,
            imageAutorotate: this.outputImageAutorotate,
            imageBackground: this.outputImageBackground,
            imageBlur: this.outputImageBlur,
        };
    }
    protected _createTempFileName(mimeType: string): string {
        if (!this.session)
            this.session = fs.mkdtempSync(join(tmpdir(), 'dokuboss-'));

        return dokeBoss.createTempFileName(this.session, mimeType);
    }

    public static createTempFileName(session: string, mimeType: string, moduleName: string = ''): string {
        const ext = dokeBoss.getExtensionByMimeType(mimeType);
        if (!ext)
            throw new Error('unrecognized mimeType');

        return join(session, (moduleName ? (moduleName + "-") : "") + Math.random().toString(36).substring(7) + '.' + ext);
    }

    async convert(options: any = {}): Promise<Buffer> {
        this.mode = 'convert';

        //convert from inputFile inputMimeType to outputFile outputMimeType
        await this.applyModules(options);

        return this.getResult();
    }

    async preview(options: any = {}): Promise<Buffer | string> {
        this.mode = 'preview';

        if (!this.outputMimeType.startsWith('image/')) {
            throw new Error('outputMimeType must be image');
        }

        await this.applyModules(options);
        //make image from inputFile inputMimeType to outputFile outputMimeType (image/)

        return this.getResult();
    }

    async applyModules(options: any): Promise<Buffer> {
        console.log(this.mode, this.inputFileName, this.inputMimeType, this.outputFileName, this.outputMimeType);
        let buffer: Buffer = fs.readFileSync(this.inputFileName, { flag: 'r' });
        const res = await super.applyModules(this.inputMimeType, buffer, this.mode, options);
        let buff = res;

        for (let i in this.afterList) {
            const { mode, options } = this.afterList[i];
            buff = await super.applyModules(this.outputMimeType, buff, mode, options);
        }

        fs.writeFileSync(this.outputFileName, buff, { flag: 'w', encoding: 'binary' });
        return res;
    }

    async getResult(): Promise<Buffer> {
        //here we must remove temp files if they are exists
        return fs.readFileSync(this.outputFileName, { flag: 'r' });
    }

    static getMimeTypeByExtention(pathToFile: string): string | false {
        const ext = pathToFile.split('.').pop();
        for (let mime in db) {
            if (db[mime] && db[mime]?.extensions)
                if (db[mime]?.extensions.indexOf(ext) != -1)
                    return mime;
        }

        return false;
    }
    static getExtensionByMimeType(mimeType: string): string | false {
        if (db[mimeType] && db[mimeType]?.extensions)
            return db[mimeType]?.extensions[0] || false;

        return false;
    }

    static from(pathToFile: string, mimeType?: string): dokeBoss {
        const mime = mimeType ?? dokeBoss.getMimeTypeByExtention(pathToFile);
        if (!mime)
            throw new Error('unrecognized mimeType');
        return new dokeBoss(pathToFile, mime);
    }

    static fromBuffer(buffer: Buffer, mimeType: string): dokeBoss {
        if (!mimeType || !buffer)
            throw new Error('mimeType is required');

        return new dokeBoss(buffer, mimeType);
    }

    static fromUrl(url: string): dokeBoss {
        throw new Error('not implemented');
    }

    static bulk(glob: string): dokeBoss {
        throw new Error('not implemented');
    }

}