import spawn = require("await-spawn");
import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossDocumentPreviewModule extends dokeBossModule {

    constructor(parent) {
        super('document-preview', 'preview', parent);
    }

    async preview(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        const inputFile = this.prepareFile(this.bufferMimeType, this.buffer);
        const outputPdfFile = this.prepareFile('application/pdf');
        const outputFile = this.prepareFile(mimeType);

        try {
            await spawn('unoconvert', ['--host-location', 'remote', inputFile, outputPdfFile]);
        } catch (e) {
            console.log('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
            this.error = e;
            throw new Error('can not preview document');
        }

        try {
            await spawn('magick', [outputPdfFile + "[0]", '-density', '150', '-trim', '-flatten', '-quality', '100', '-sharpen', '0x1.0', outputFile], { timeout: 15000 });

            return this.fileContent(outputFile);
        } catch (e) {
            console.log('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
            this.error = e;
        }

        throw new Error('can not preview document');

    }

}