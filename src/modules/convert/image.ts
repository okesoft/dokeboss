import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossImageConvertModule extends dokeBossModule {

    constructor(parent) {
        super('image-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            return {
                command: 'magick',
                args: [inputFile, outputFile],
            }
        }
    }

}