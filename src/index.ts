import fs from 'fs';
import { join } from 'node:path';
import db from './db';
import axios from 'axios';
import FormData from 'form-data';
const fg = require('fast-glob');
import dokeBossBase, { dokeBossModuleList } from './base';
import getConfig from "./cfg";
import { spawn } from 'child_process'
import dokeBossCallbackModule from './callbackmodule';

export type dokeBossMode = 'preview' | 'convert' | 'crop';
export type dokeBossOptions = {
    imageAutorotate?: boolean;
    imageBackground?: any;
    imageBlur?: boolean;
    //
    videoForceAspect?: boolean;
    videoStreamable?: boolean;
    videoWebmOptimized?: boolean;
    //
    width?: number,
    height?: number,
    quality?: number,
}
export type dokeBossOptionsExtended = dokeBossOptions & {
    [key: string]: any
}

export default class dokeBoss extends dokeBossBase {
    public static dokeBossBase: dokeBossBase;
    protected static globalModules: dokeBossModuleList[] = [];
    protected static downloadTimeOut = 120000;
    //https?://host:port
    protected static remote: string | false = false;

    public static timeout = 15000;
    protected session: string = '';
    protected inputTemp: boolean = false;
    protected fromUrl: boolean = false;
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
    protected inputOriginalFileName: string | Buffer<ArrayBufferLike> = '';
    protected videoStreamable: boolean = false;
    protected videoWebmOptimized: boolean = false;

    constructor(fileName: string | Buffer, mimeType: string, modules: dokeBossModuleList[] = []) {
        super(modules);

        this.inputOriginalFileName = fileName;
        this.createSessionDirectory();

        if (dokeBoss.globalModules.length) {
            for (let i in dokeBoss.globalModules) {
                if (dokeBoss.globalModules[i].on == 'before')
                    this.addModule(dokeBoss.globalModules[i]);
            }
        }

        this.addModule({
            mimeType: /image\/.*|application\/pdf/,
            mode: 'preview',
            file: './modules/preview/image'
        });
        this.addModule({
            mimeType: /image\/.*|application\/pdf/,
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
            mimeType: /^(?!image\/)(?!video\/)(?!text\/html).+$/,
            mode: 'preview',
            file: './modules/preview/document'
        });
        this.addModule({
            mimeType: /^(?!image\/)(?!video\/)(?!text\/html).+$/,//todo: maybe application/pdf should exclude also
            mode: 'convert',
            file: './modules/convert/document'
        });

        this.addModule({
            mimeType: /text\/html/,
            mode: 'preview',
            file: './modules/preview/html'
        });
        this.addModule({
            mimeType: /text\/html/,
            mode: 'convert',
            file: './modules/convert/html'
        });

        if (dokeBoss.globalModules.length) {
            for (let i in dokeBoss.globalModules) {
                if (dokeBoss.globalModules[i].on == 'after' || !dokeBoss.globalModules[i].on)
                    this.addModule(dokeBoss.globalModules[i]);
            }
        }

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

        if (fileName.indexOf('http:') == 0 || fileName.indexOf('https:') == 0) {
            this.fromUrl = true;
            this.inputFileName = this._createTempFileName(this.inputMimeType);
            if (this.inputMimeType == 'text/html') {
                fs.writeFileSync(this.inputFileName, fileName.toString(), { flag: 'w', encoding: 'utf8' });
            } else {
                fs.writeFileSync(this.inputFileName, fileName.toString(), { flag: 'w', encoding: 'binary' });
            }
        } else if (fileName instanceof Buffer) {
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
    protected createSessionDirectory() {
        if (!this.session)
            this.session = fs.mkdtempSync(join(getConfig().sessionBasePath, 'dokuboss-'));

        if (!fs.existsSync(getConfig().sessionBasePath)) {//if we start from docker - use ./data for session, otherwise - tmpdir
            try {
                fs.mkdirSync(getConfig().sessionBasePath, { recursive: true });
            } catch (e) {

            }
        }
    }
    to(pathToFile: string, options: dokeBossOptionsExtended & { mimeType?: string } = {}, callback?: (obj: dokeBoss) => void): dokeBoss {

        if (!options)
            options = {};

        if (!callback)
            callback = () => { };

        if (!pathToFile)
            throw new Error('pathToFile is required');

        if (!options.mimeType) {
            const mime = dokeBoss.getMimeTypeByExtention(pathToFile);
            if (mime) {
                options.mimeType = mime;
                this.outputMimeType = mime;
            } else {
                throw new Error('unrecognized mimeType');
            }
        } else {
            this.outputMimeType = options.mimeType;
        }

        const ext = dokeBoss.getExtensionByMimeType(this.outputMimeType);
        if (!ext)
            throw new Error('unrecognized mimeType');

        try {
            fs.writeFileSync(pathToFile, "", { flag: 'w', encoding: 'binary' });
            this.outputFileName = pathToFile;
        } catch (e) {
            console.error(e)
            throw new Error('pathToFile is not writable');
        }

        this.setOptions(options);

        callback(this);
        return this;
    }
    toBuffer(mimeType: string, options?: dokeBossOptionsExtended): dokeBoss {
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

        if (options.videoStreamable)
            this.videoStreamable = options.videoStreamable;

        if (options.videoWebmOptimized)
            this.videoWebmOptimized = options.videoWebmOptimized;

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
            videoForceAspect: this.outputVideoForceAspect,
            videoStreamable: this.videoStreamable,
            videoWebmOptimized: this.videoWebmOptimized
        };
    }
    protected _createTempFileName(mimeType: string): string {
        this.createSessionDirectory();
        return dokeBoss.createTempFileName(this.session, mimeType);
    }

    public static createTempFileName(session: string, mimeType: string, moduleName: string = ''): string {
        const ext = dokeBoss.getExtensionByMimeType(mimeType);
        if (!ext)
            throw new Error('unrecognized mimeType');

        return join(session, (moduleName ? (moduleName + "-") : "") + Math.random().toString(36).substring(7) + '.' + ext);
    }

    async downloadFile() {
        if (this.fromUrl && this.inputMimeType != 'text/html') {

            try {
                const response = await axios.get(fs.readFileSync(this.inputFileName, { flag: 'r' }).toString(), { timeout: dokeBoss.downloadTimeOut, responseType: 'arraybuffer' });
                const data = Buffer.from(response.data, 'binary');
                fs.writeFileSync(this.inputFileName, data, { flag: 'w', encoding: 'binary' });
            } catch (e) {
                console.error(e);
                throw new Error('can not download file');
            }

        }
    }
    static setDownloadTimeout(timeout: number): typeof dokeBoss {
        dokeBoss.downloadTimeOut = timeout;
        return dokeBoss;
    }

    static setRemote(remote: string | boolean): typeof dokeBoss {
        try {

            if (!remote)
                return;

            if (remote === true) {
                remote = 'http://localhost:5001';
            }

            const url = new URL(remote);
            dokeBoss.remote = remote;
            return dokeBoss;
        } catch (e) {
            throw new Error('remote is not valid, must be an url https?://host:port');
        }
    }

    async doRemote(options: any = {}): Promise<Buffer> {

        let request: any = {};
        const data = new FormData();
        const uploadId = require('crypto')
            .createHash('sha256')
            .update(fs.readFileSync(this.inputFileName, { flag: 'r', encoding: 'binary' }))
            .update(JSON.stringify(options))
            .digest('hex');

        data.append('type', this.mode);
        data.append('outputMimeType', this.outputMimeType);
        data.append('options', JSON.stringify(options));
        data.append('file', fs.createReadStream(this.inputFileName), this.inputFileName.split('/').pop());
        data.append('uploadId', uploadId);
        //console.log(dokeBoss.remote + "/upload", uploadId);
        try {
            request = await axios.request({
                method: 'post',
                url: dokeBoss.remote + "/upload",
                data,
                timeout: dokeBoss.timeout,
                responseType: 'arraybuffer'
            });

            fs.writeFileSync(this.outputFileName, request.data, { flag: 'w', encoding: 'binary' });

            return Buffer.from(request.data);
        } catch (e) {
            console.log('error', e.response?.status, e.response?.statusText, e.message)
            throw new Error('can not convert file with remote');
        }

    }

    async doRemoteCheck(method: string, options: any = {}): Promise<boolean> {
        let request: any = {};
        const data = new FormData();
        const uploadId = require('crypto')
            .createHash('sha256')
            .update(fs.readFileSync(this.inputFileName, { flag: 'r', encoding: 'binary' }))
            .update(JSON.stringify(options))
            .digest('hex');

        data.append('method', method);
        data.append('file', fs.createReadStream(this.inputFileName), this.inputFileName.split('/').pop());
        data.append('uploadId', uploadId);

        try {
            request = await axios.request({
                method: 'post',
                url: dokeBoss.remote + "/check",
                data,
                timeout: dokeBoss.timeout,
                responseType: 'json'
            });

            return request.data.result;
        } catch (e) {
            console.log('error', e.response?.status, e.response?.statusText, e.message)
            throw new Error('can not check file with remote');
        }
    }

    async convert(options: dokeBossOptionsExtended = {}): Promise<Buffer> {
        this.mode = 'convert';

        await this.downloadFile();

        if (dokeBoss.remote) {
            return this.doRemote(Object.assign({}, this.getOptions(), options));
        }

        await this.applyModules(Object.assign({}, this.getOptions(), options));

        return this.getResult();
    }

    async preview(options: dokeBossOptionsExtended = {}): Promise<Buffer> {
        this.mode = 'preview';
        if (!this.outputMimeType.startsWith('image/')) {
            throw new Error('outputMimeType must be image');
        }

        await this.downloadFile();

        if (dokeBoss.remote) {
            return this.doRemote(Object.assign({}, this.getOptions(), options));
        }

        await this.applyModules(Object.assign({}, this.getOptions(), options));

        return this.getResult();
    }

    async applyModules(options: any): Promise<Buffer> {
        let buffer: Buffer = fs.readFileSync(this.inputFileName, { flag: 'r' });
        let buff = buffer;

        for (let i in this.beforeList) {
            const { mode, options, callback } = this.beforeList[i];

            if (callback && callback instanceof Function) {
                const obj = new dokeBossCallbackModule(mode, callback, this);
                const tmp = await obj.run(buff, this.inputMimeType, mode, options);
                if (!tmp) {
                    console.error('error in module ' + obj.moduleName, obj.getError().stderr?.toString() ?? obj.getError().message);
                } else {
                    buff = tmp;
                }
            } else {
                buff = await super.applyModules(this.inputMimeType, buff, mode, options);
            }
        }

        buff = await super.applyModules(this.inputMimeType, buff, this.mode, options);

        for (let i in this.afterList) {
            const { mode, options, callback } = this.afterList[i];
            if (callback && callback instanceof Function) {
                const obj = new dokeBossCallbackModule(mode, callback, this);
                const tmp = await obj.run(buffer, this.inputMimeType, mode, options);
                if (!tmp) {
                    console.error('error in module ' + obj.moduleName, obj.getError().stderr?.toString() ?? obj.getError().message);
                } else {
                    buff = tmp;
                }
            } else {
                buff = await super.applyModules(this.outputMimeType, buff, mode, options);
            }
        }

        fs.writeFileSync(this.outputFileName, buff, { flag: 'w', encoding: 'binary' });
        return buff;
    }

    async getResult(): Promise<Buffer> {
        //here we must remove temp files if they are exists
        return fs.readFileSync(this.outputFileName, { flag: 'r' });
    }

    getOriginalFileName(): string | Buffer<ArrayBufferLike> {
        return this.inputOriginalFileName;
    }
    getOutputFileName(): string {
        return this.outputFileName;
    }
    getVideoMoovDataOffsets(): Promise<{ type: string, offset: number | null, size: number }[]> {
        return dokeBoss.getVideoMoovDataOffsets(this.inputFileName, this.inputMimeType);
    }
    /**
     Streaming web sites recommend to upload videos with Fast Start enabled. 
     This allows video playback to begin before the file has been completely downloaded.
     Why ?
     Normally, a MP4 file has all the metadata about all packets stored at the end of the file, in data units named atoms. 
     The "mdat" atom is located before the "moov" atom. 
     If the file is created by adding the -movflags faststart option to the ffmpeg command line, 
     the "moov" atom is moved at the beginning of the MP4 file during the ffmpeg second pass. 
     By using this option, the "moov" atom is located before the "mdat" atom.
     In other words, the file is enabled for Fast Start playback only when the "moov" atom is located before the "mdat" atom.
     */
    async isStreamable(): Promise<boolean> {

        await this.downloadFile();

        if (dokeBoss.remote) {
            return this.doRemoteCheck('isStreamable');
        }

        const arr = await dokeBoss.getVideoMoovDataOffsets(this.inputFileName, this.inputMimeType);
        if (arr[0].type == 'moov' && arr[0].offset < 100) {
            //moov data means moov before mdat, fast start means moov data is at the beginning of the file (offset less then 100 bytes). 
            return true;
        }

        return false;
    }
    static async isStreamable(pathToFile: string | Buffer, mimeType?: string): Promise<boolean> {
        const doke = dokeBoss.from(pathToFile, mimeType);
        return doke.isStreamable();
    }
    static async getVideoMoovDataOffsets(path: string, mimeType: string): Promise<{ type: string, offset: number | null, size: number }[]> {
        if (!mimeType.startsWith('video/'))
            throw new Error('isStreamable available only for videos');

        return new Promise((resolve, reject) => {

            const grep = spawn('grep', ["-e", "type:'mdat'", "-e", "type:'moov'"]);
            const ps = spawn('ffmpeg', ['-v', 'trace', '-i', path]);

            ps.stderr.pipe(grep.stdin);

            grep.stdout.on('data', function (data) {
                const list = data.toString('utf8').trim().split('\n').map(line => line.trim());
                const arr: { type: string, offset: number, size: number }[] = [];
                for (let line of list) {
                    const match = /\]\s*type\:\'(.*?)\'.*sz\:\s*(.*)/g.exec(line);
                    const [size, offset] = match ? match[2].split(' ') : '';
                    arr.push({
                        type: match ? match[1] : '',
                        size: parseInt(size) || 0,
                        offset: parseInt(offset) || null
                    });
                }

                resolve(arr)
            });

            grep.stderr.on('data', function (data) {
                reject('can not find moov data');
            });

            setTimeout(() => {
                reject('timeout');
            }, 10000);

        });
    }
    static setOperationTimeout(timeout: number): typeof dokeBoss {
        dokeBoss.timeout = timeout;
        return dokeBoss;
    }

    static getMimeTypeByExtention(pathToFile: string): string | false {
        const ext = pathToFile.split('.').pop().toLowerCase();
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

    static from(pathToFile: string | Buffer, mimeType?: string): dokeBoss {
        if (typeof pathToFile == 'string' && (pathToFile.indexOf('http:') != -1 || pathToFile.indexOf('https:') != -1)) {
            return dokeBoss.fromUrl(pathToFile);
        }

        let mime = mimeType ?? dokeBoss.getMimeTypeByExtention(typeof pathToFile == 'string' ? pathToFile : '');
        if (!mime)
            throw new Error('unrecognized mimeType');
        return new dokeBoss(pathToFile, mime);
    }

    static fromUrl(url: string): dokeBoss {
        if (!url)
            throw new Error('url is required');

        if (!(url.indexOf('http:') != -1 || url.indexOf('https:') != -1)) {
            throw new Error('url is not valid');
        }

        let mime = 'text/html';
        const u = new URL(url);
        const ext = u.pathname.split('.').pop();
        if (ext) {
            const m = dokeBoss.getMimeTypeByExtention(ext);
            if (m)
                mime = m;
        }

        return new dokeBoss(url, mime);
    }

    static sitePreview(url: string, options: any = {}): Promise<Buffer> {
        return dokeBoss.fromUrl(url).preview(options || {});
    }

    static fromBuffer(buffer: Buffer, mimeType: string): dokeBoss {
        if (!buffer)
            throw new Error('buffer is required');

        if (!mimeType)
            throw new Error('mimeType is required');

        return new dokeBoss(buffer, mimeType);
    }

    /**
     * 
     * @param mode {dokeBossMode}
     * @param fromGlob {string | string[]}
     * @param toFile {string} - will change {name} to file name
     * @param options {any}
     * @param callback {(obj: dokeBoss) => void}
     * @returns {Promise<dokeBoss[]>}
     */
    static async bulk(mode: dokeBossMode, fromGlob: string | string[], toFile: string, options?: any, callback?: (obj: dokeBoss) => void): Promise<dokeBoss[]> {
        if (!options)
            options = {};

        if (toFile.indexOf("{name}") == -1)
            throw new Error('toFile must contain {name} placeholder');

        if (!callback)
            callback = () => { };

        const files = await fg(fromGlob);
        if (!files.length)
            return [];

        const res: dokeBoss[] = [];
        for (let i in files) {
            const name = files[i].split('/').pop().split('.').shift();
            const file = files[i];
            //after can be in callback
            const obj = dokeBoss.from(file)
                .to(toFile.split("{name}").join(name), options, callback)

            if (mode == 'preview') {
                await obj.preview();
            } else if (mode == 'convert') {
                await obj.convert();
            }

            res.push(obj);
        }

        return res;
    }

    static addModule(module: dokeBossModuleList): typeof dokeBoss {
        dokeBoss.globalModules.push(module);
        return dokeBoss;
    }
    static unloadModules(): typeof dokeBoss {
        dokeBoss.globalModules = [];
        return dokeBoss;
    }
}