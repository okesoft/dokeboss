import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";
import getConfig from "../../cfg";

export default class dokeBossImageConvertModule extends dokeBossModule {

    constructor(parent) {
        super('image-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            return {
                command: getConfig().ImagickCommand,
                args: [inputFile, outputFile],
            }
        }
    }

}