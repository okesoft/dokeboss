import dokeBossModule, { dokeBossModuleCmdCallback } from "../..//module";
import puppeteer from 'puppeteer';
import fs from 'fs';
import spawn = require("await-spawn");
import url from 'url';

export default class dokeBossHtmlConvertModule extends dokeBossModule {

    constructor(parent) {
        super('document-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        const inputFile = this.prepareFile(this.bufferMimeType, this.buffer);
        const outputPdfFile = this.prepareFile('application/pdf');
        const outputFile = this.prepareFile(mimeType);

        const url_ = fs.readFileSync(inputFile, 'utf8');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1024 });

        await page.goto(url_, {
            waitUntil: 'networkidle2',
        });

        await page.pdf({
            path: outputPdfFile,
            format: 'LETTER',
        });

        await browser.close();
        console.log('pdf', outputPdfFile, outputFile);

        try {
            await spawn('unoconvert', ['--host-location', 'remote', outputPdfFile, outputFile], { timeout: 150000 });
        } catch (e) {
            console.log('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
            this.error = e;
        }

        //todo: check libreoffice headless
        /*try {
            console.log([
                '--headless',
                '--convert-to',
                dokuBoss.getExtensionByMimeType(mimeType) + ':"' + dokuBoss.getExtensionByMimeType(mimeType) + '"',
                '--outdir',
                this.session,
                url.pathToFileURL(outputPdfFile)
            ].join(' '));

            await spawn('soffice', [
                '--convert-to',
                dokuBoss.getExtensionByMimeType(mimeType),//+ ':"' + dokuBoss.getExtensionByMimeType(mimeType) + '"',
                '--headless',
                '--outdir',
                this.session,
                url.pathToFileURL(outputPdfFile)
            ], { timeout: 120000 });
        } catch (e) {
            console.log('error while module ' + this.moduleName, e.stderr?.toString() ?? e.message);
            this.error = e;
            throw new Error('can not preview document');
        }*/

        return this.fileContent(outputFile);
    }

}