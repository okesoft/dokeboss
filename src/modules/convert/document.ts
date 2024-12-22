import dokeBossModule from "../../module";

export default class dokeBossDocumentConvertModule extends dokeBossModule {

    constructor(parent) {
        super('document-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer> {
        console.log('convert document');
        return Buffer.from('');
    }

}