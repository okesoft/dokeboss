import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossImagePreviewModule extends dokeBossModule {

    constructor(parent) {
        super('image-preview', 'preview', parent);
    }

    async preview(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            this.debug = true;
            const args = [inputFile, outputFile];

            if (options.width > 0) {
                args.splice(
                    1,
                    0,
                    '-resize',
                    options.width + 'x' + options.height
                );
            }

            if (options.autorotate) {
                args.splice(1, 0, '-auto-orient');
            }

            if (options.quality) {
                args.splice(1, 0, '-quality', options.quality);
            }

            if (options.background) {
                args.splice(1, 0, '-background', options.background);
                args.splice(1, 0, '-flatten');
            }

            if (options.blur) {
                args.splice(1, 0, '-blur', '0x8');
            }

            return {
                command: 'magick',
                args
            }
        }
    }

}