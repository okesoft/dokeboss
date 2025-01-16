import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";
import getConfig from "../../cfg";
import { dokeBossOptionsExtended } from "../..";

export default class dokeBossImagePreviewModule extends dokeBossModule {

    constructor(parent) {
        super('image-preview', 'preview', parent);
    }

    async preview(options: dokeBossOptionsExtended, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            this.debug = true;
            const args = [inputFile + "[0]", outputFile];

            if (options.width > 0) {
                args.splice(
                    1,
                    0,
                    '-resize',
                    options.width + 'x' + (options.height && options.height > 0 ? options.height : '')
                );
            }

            if (options.imageAutorotate) {
                args.splice(1, 0, '-auto-orient');
            }

            if (options.quality) {
                args.splice(1, 0, '-quality', "" + options.quality);
            }

            if (options.imageBackground) {
                args.splice(1, 0, '-background', options.imageBackground);
                args.splice(1, 0, '-flatten');
            }

            if (options.imageBlur) {
                args.splice(1, 0, '-blur', '0x8');
            }

            return {
                command: getConfig().ImagickCommand,
                args
            }
        }
    }

}