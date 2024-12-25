import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossDocumentConvertModule extends dokeBossModule {

    constructor(parent) {
        super('document-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            console.log('convert', inputFile, outputFile)
            return {
                command: 'unoconvert',
                args: ['--host-location', 'remote', inputFile, outputFile],
                timeout: 120000
            }
        }
    }

}