import dokeBossModule, { dokeBossModuleCmdCallback } from "./module"

export default class dokeBossCallbackModule extends dokeBossModule {
    callback: (options: any, mimeType: string) => dokeBossModuleCmdCallback;

    constructor(mode, callback: (options: any, mimeType: string) => dokeBossModuleCmdCallback, parent) {
        super('callback', mode, parent);
        this.callback = callback;
    }

    async runCallback(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        return this.callback(options, mimeType);
    }
}