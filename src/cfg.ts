import commandExists from "command-exists";
import fs from "fs";
import { tmpdir } from 'os';

type Config = {
    ImagickCommand: string
    GetUnoconvertCmdArgs: (inputFile: string, outputFile: string) => Array<string>,
    sessionBasePath: string
}
function getConfig(): Config {
    if (!getConfig.__cfg) {
        let cfg: Config = {
            ImagickCommand: 'convert',
            GetUnoconvertCmdArgs: (inputFile, outputFile) => { return ['--host-location', 'remote', inputFile, outputFile] },
            sessionBasePath: tmpdir()
        }
        if (commandExists.sync('magick')) {
            cfg.ImagickCommand = 'magick'
        } else if (!commandExists.sync('convert')) {
            throw new Error('Imagick not found (neither magick, nor convert)')
        }

        if (fs.existsSync("/.dockerenv")) {
            cfg.GetUnoconvertCmdArgs = (inputFile, outputFile) => { return ['--host-location', 'remote', '--host', 'unoserver', inputFile, outputFile] }
            cfg.sessionBasePath = './data';
        }

        getConfig.__cfg = cfg
    }
    return getConfig.__cfg
}
namespace getConfig {
    export let __cfg: Config
}

export default getConfig