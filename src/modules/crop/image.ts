import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossImageCropModule extends dokeBossModule {

    constructor(parent) {
        super('image-crop', 'crop', parent);
    }

    async crop(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            return {
                command: 'magick',
                args: [inputFile, '-crop', options.width + 'x' + options.height + '+' + options.x + '+' + options.y, outputFile],
            }
        }
    }

}