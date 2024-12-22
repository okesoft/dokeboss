import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";

export default class dokeBossDocumentPreviewModule extends dokeBossModule {

    constructor(parent) {
        super('document-preview', 'preview', parent);
    }

    async preview(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        console.log('preview document');
        return Buffer.from('');
    }

}