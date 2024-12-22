import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossVideoConvertModule extends dokeBossModule {

    constructor(parent) {
        super('video-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        this.debug = true;
        return async (inputFile, outputFile) => {
            return {
                command: 'ffmpeg',
                args: ['-i', inputFile, outputFile],
                timeout: 150000
            }
        }
    }

}