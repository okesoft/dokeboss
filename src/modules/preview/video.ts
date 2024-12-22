import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossVideoPreviewModule extends dokeBossModule {

    constructor(parent) {
        super('video-preview', 'preview', parent);
    }

    async preview(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        this.debug = true;
        return async (inputFile, outputFile) => {
            const args = [
                '-y',
                '-i',
                inputFile,
                '-vf',
                'thumbnail',
                '-frames:v',
                '1',
                outputFile
            ];

            if (options.width > 0 && options.height > 0) {
                args.splice(
                    4,
                    1,
                    'thumbnail,scale=' +
                    options.width +
                    ':' +
                    options.height +
                    (options.forceAspect
                        ? ':force_original_aspect_ratio=decrease'
                        : '')
                );
            }

            return {
                command: 'ffmpeg',
                args,
                timeout: 120000
            }
        }

    }

}