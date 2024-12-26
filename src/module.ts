import { join } from "path";
import dokeBoss, { dokeBossMode } from "./index";
import fs from "fs";
import dokeBossCallbackModule from "./callbackmodule";
const spawn = require('await-spawn');

export type dokeBossModuleCmd = { command: string, args?: string[], timeout?: number } | Buffer;
export type dokeBossModuleCmdCallback = (inputFile: string, outputFile: string) => Promise<dokeBossModuleCmd>;
export default class dokeBossModule {
    public moduleName: string;
    protected mode: dokeBossMode = 'preview';
    protected debug: boolean = false;
    protected type: 'input' | 'output' = 'output';
    protected parent: dokeBoss;
    protected buffer: Buffer = Buffer.from('');
    protected outBuffer: Buffer = Buffer.from('');
    protected bufferMimeType: string;
    protected session: string;
    protected error: any = null;

    constructor(name: string, mode: dokeBossMode, parent: dokeBoss) {
        this.moduleName = name;
        this.mode = mode;
        this.parent = parent;
        this.session = parent.getSession();
    }

    public getMode() {
        return this.mode;
    }

    protected async doCmd(mimeType: string, callback: dokeBossModuleCmdCallback): Promise<Buffer | false> {
        const inputFile = this.prepareFile(this.bufferMimeType, this.buffer);
        const outputFile = this.prepareFile(mimeType);

        try {
            let res: dokeBossModuleCmd = await callback(inputFile, outputFile);
            if (res instanceof Buffer) {
                fs.writeFileSync(outputFile, res);
                return res;
            } else if ('command' in res) {
                let { command, args, timeout } = res;

                if (!args)
                    args = [inputFile, outputFile];

                if (this.debug)
                    console.log('doCmd debug >>', command, args.join(' '));

                await spawn(command, args, { timeout: timeout || 15000, detached: true });
                return this.fileContent(outputFile);
            }
        } catch (e) {
            console.error(e);
            //console.log('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
            //throw e;
            this.error = e;
        }

        return false;
    }

    public getError() {
        return this.error;
    }

    protected _createTempFileName(mimeType: string): string {
        return join(this.session, this.moduleName + "-" + Math.random().toString(36).substring(7) + '.' + dokeBoss.getExtensionByMimeType(mimeType));
    }

    protected prepareFile(mimeType: string, buffer: Buffer = null): string {
        const inputFile = this._createTempFileName(mimeType);
        if (buffer)
            fs.writeFileSync(inputFile, buffer, { flag: 'w', encoding: 'binary' });
        return inputFile;
    }

    protected async fileContent(file: string): Promise<Buffer> {
        return new Promise(resolve => {
            fs.readFile(file, (err, data) => {
                if (err) {
                    console.error(err);
                    throw err;
                } else {
                    resolve(data);
                }
            });
        })
    }

    public async run(buffer: Buffer, bufferMimeType: string, mode: dokeBossMode = 'preview', options: any = {}): Promise<Buffer | false> {
        this.buffer = buffer;
        this.bufferMimeType = bufferMimeType;
        let destMime = options?.mimeType ?? this.parent.getDestMimeType();

        let res;
        if (this instanceof dokeBossCallbackModule) {
            res = await this.runCallback(Object.assign({}, this.parent.getOptions(), options), destMime);
        } else {
            res = await this[mode](Object.assign({}, this.parent.getOptions(), options), destMime);
        }

        if (res instanceof Function) {
            return this.doCmd(destMime, res);
        }

        return res;
    }

    protected async preview(options: any = {}, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return Buffer.from('');
    }

    protected async convert(options: any = {}, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return Buffer.from('');
    }

}