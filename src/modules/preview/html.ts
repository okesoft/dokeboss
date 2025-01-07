import spawn = require("await-spawn");
import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";
import puppeteer from 'puppeteer';
import fs from 'fs';
import getConfig from "../../cfg";

export default class dokeBossDocumentPreviewModule extends dokeBossModule {

    constructor(parent) {
        super('document-preview', 'preview', parent);
    }

    async preview(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        const inputFile = this.prepareFile(this.bufferMimeType, this.buffer);
        const outputPdfFile = this.prepareFile('application/pdf');
        const outputFile = this.prepareFile(mimeType);

        const url = fs.readFileSync(inputFile, 'utf8');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1024 });

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        await page.pdf({
            path: outputPdfFile,
            format: 'LETTER',
        });

        await browser.close();

        try {
            await spawn(getConfig().ImagickCommand, [outputPdfFile + "[0]", '-density', '500', '-trim', '-flatten', '-quality', '100', outputFile], { timeout: 15000 });
        } catch (e) {
            console.error('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
            this.error = e;
        }

        return this.fileContent(outputFile);
    }

}