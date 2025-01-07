import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";
import getConfig from "../../cfg";

export default class dokeBossDocumentConvertModule extends dokeBossModule {

    constructor(parent) {
        super('document-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return async (inputFile, outputFile) => {
            return {
                command: 'unoconvert',
                args: getConfig().GetUnoconvertCmdArgs(inputFile, outputFile),
                timeout: 120000
            }
        }
    }

}