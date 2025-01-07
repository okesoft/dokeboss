import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";
import getConfig from "../../cfg";

export default class dokeBossImageCropModule extends dokeBossModule {

    constructor(parent) {
        super('image-crop', 'crop', parent);
    }

    async crop(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            return {
                command: getConfig().ImagickCommand,
                args: [inputFile, '-crop', (options.width || 300) + 'x' + (options.height || 300) + '+' + (options.x || 0) + '+' + (options.y || 0), outputFile],
            }
        }
    }

}