import { dokeBossMode, dokeBossOptions } from ".";
import dokeBossModule from "./module";

export type dokeBossModuleList = { mimeType: string[] | RegExp, mode: dokeBossMode, file: string };
export default class dokeBossBase {
    protected modules: { [key: string]: dokeBossModuleList[] } = {};
    protected afterList: { mode: dokeBossMode, options: any }[] = [];

    constructor(modules: dokeBossModuleList[] = []) {
        for (let module of modules) {
            this.addModule(module);
        }
    }
    addModule(module: dokeBossModuleList): dokeBossBase {
        const { mimeType, file, mode } = module;
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
                const cls = require(file);
                obj = new cls.default(this);
            } catch (e) {

            }

            if (!obj)
                throw new Error('can not create module ' + file);

            if (!(mimeType instanceof RegExp)) {
                for (let mt of mimeType) {
                    data[mt].push(obj);
                }
            } else {
                data[mimeType.source].push(obj);
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
                    if (module instanceof dokeBossModule && module.getMode() == mode) {
                        //console.log('apply module ' + module.moduleName + ' for ' + mimeType, reg);
                        const tmp = await module.run(buffer, mode, options);
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
    after(mode: dokeBossMode, options: any): dokeBossBase {
        this.afterList.push({ mode, options });
        return this;
    }

}