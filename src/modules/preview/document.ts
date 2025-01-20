import spawn = require("await-spawn");
import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";
import getConfig from "../../cfg";
import { dokeBossOptionsExtended } from "../..";

export default class dokeBossDocumentPreviewModule extends dokeBossModule {

    constructor(parent) {
        super('document-preview', 'preview', parent);
    }

    async preview(options: dokeBossOptionsExtended, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        const inputFile = this.prepareFile(this.bufferMimeType, this.buffer);
        let outputPdfFile;
        const outputFile = this.prepareFile(mimeType);

        if (this.bufferMimeType != 'application/pdf') {
            outputPdfFile = this.prepareFile('application/pdf');
            try {
                await spawn(
                    'unoconvert',
                    getConfig().GetUnoconvertCmdArgs(inputFile, outputPdfFile),
                );
            } catch (e) {
                console.error('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
                this.error = e;
                //throw new Error('can not preview document');
            }
        } else {
            outputPdfFile = inputFile;
        }

        try {
            const args = [outputPdfFile + "[0]", '-density', '150', '-trim', '-flatten', '-quality', '100', '-sharpen', '0x1.0', outputFile];
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

            //console.log('args', args)
            await spawn(getConfig().ImagickCommand, args, { timeout: this.timeout });

            return this.fileContent(outputFile);
        } catch (e) {
            console.error('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
            this.error = e;
        }

        throw new Error('can not preview document');

    }

}