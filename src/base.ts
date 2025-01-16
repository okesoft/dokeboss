import dokeBoss, { dokeBossMode } from "./index";
import dokeBossCallbackModule from "./callbackmodule";
import dokeBossModule, { dokeBossModuleCmdCallback } from "./module";

export type dokeBossModuleList = {
    on?: 'before' | 'after',
    mimeType: string[] | RegExp,
    mode: dokeBossMode,
    file?: string,
    callback?: (options: any, mimeType: string) => dokeBossModuleCmdCallback
};

export default class dokeBossBase {
    protected modules: { [key: string]: dokeBossModuleList[] } = {};
    protected afterList: { mode?: dokeBossMode, options: any, callback?: (options: any, mimeType: string) => dokeBossModuleCmdCallback }[] = [];
    protected beforeList: { mode?: dokeBossMode, options: any, callback?: (options: any, mimeType: string) => dokeBossModuleCmdCallback }[] = [];

    constructor(modules: dokeBossModuleList[] = []) {
        for (let module of modules) {
            this.addModule(module);
        }
    }

    public addModule(module: dokeBossModuleList, toStart = false): ThisParameterType<dokeBossBase> {
        const { mimeType, file, callback, mode } = module;

        if (!file && (!callback || !(callback instanceof Function))) {
            throw new Error('file or callback is required in module');
        }

        try {
            let data = this.modules;

            if (!(mimeType instanceof RegExp)) {
                for (let mt of mimeType) {
                    if (!data[mt])
                        data[mt] = [];
                }
            } else {
                if (!data[mimeType.source])
                    data[mimeType.source] = [];
            }

            let obj = null;
            try {
                if (callback && !file) {
                    obj = new dokeBossCallbackModule(mode, callback, this);
                    obj.setTimeout(dokeBoss.timeout);
                } else {
                    const cls = require(file);
                    obj = new cls.default(this);
                }
            } catch (e) {
                console.error('load module error:', e);
                throw new Error('can not load module ');
            }

            if (!obj)
                throw new Error('can not create module ' + file);

            if (!(mimeType instanceof RegExp)) {
                for (let mt of mimeType) {
                    if (toStart) {
                        data[mt].unshift(obj);
                    } else {
                        data[mt].push(obj);
                    }
                }
            } else {
                if (toStart) {
                    data[mimeType.source].unshift(obj);
                } else {
                    data[mimeType.source].push(obj);
                }
            }

            this.modules = data;
        } catch (e) {
            console.error(e);
            throw new Error('can not load module ' + file);
        }
        return this;
    }
    async applyModules(mimeType: string, buffer: Buffer, mode: dokeBossMode = 'convert', options?: any): Promise<Buffer> {
        for (let i in this.modules) {
            const reg = new RegExp(i);
            if (reg.test(mimeType)) {
                for (let module of this.modules[i]) {
                    if (module instanceof dokeBossModule && (module.getMode() == mode || module instanceof dokeBossCallbackModule)) {//callback module runs at any mode
                        const tmp = await module.run(buffer, mimeType, mode, options);
                        if (!tmp) {
                            console.error('error in module ' + module.moduleName, module.getError().stderr?.toString() ?? module.getError().message);
                        } else {
                            buffer = tmp;
                        }
                    }
                }
            }
        }

        return buffer;
    }
    after(mode: dokeBossMode | ((options: any, mimeType: string) => dokeBossModuleCmdCallback), options: any = {}): dokeBossBase {
        if (mode instanceof Function) {
            this.afterList.push({ callback: mode, options });
        } else {
            this.afterList.push({ mode, options });
        }
        return this;
    }
    before(mode: dokeBossMode | ((options: any, mimeType: string) => dokeBossModuleCmdCallback), options: any = {}): dokeBossBase {
        if (mode instanceof Function) {
            this.beforeList.push({ callback: mode, options });
        } else {
            this.beforeList.push({ mode, options });
        }
        return this;
    }

    async convert(options: any = {}): Promise<Buffer> { return Buffer.from(''); }
    async preview(options: any = {}): Promise<Buffer> { return Buffer.from(''); }
}