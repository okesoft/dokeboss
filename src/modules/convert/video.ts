import { join } from "path";
import dokeBoss from "../..";
import dokeBossModule, { dokeBossModuleCmdCallback } from "../../module";
const ffmpeg = require('fluent-ffmpeg')
import fs from 'fs';

export default class dokeBossVideoConvertModule extends dokeBossModule {

    constructor(parent) {
        super('video-convert', 'convert', parent);
    }

    async convert(options: any, mimeType: string): Promise<Buffer | dokeBossModuleCmdCallback> {
        this.debug = true;
        const inputFile = this.prepareFile(this.bufferMimeType, this.buffer);
        const outputFile = this.prepareFile(mimeType);

        let process: boolean = false;
        if (options.videoWebmOptimized) {
            //its not full file path. Only prefix
            const logPath = join(this.session, this.moduleName + "-" + Math.random().toString(36).substring(7) + '.ffmpeg.log')

            process = await new Promise<Buffer>(async resolve => {
                try {
                    ffmpeg(inputFile, { logger: console })
                        .inputFormat(dokeBoss.getExtensionByMimeType(this.bufferMimeType))
                        .outputOptions(['-b:v 0', '-crf 30', '-pass 1', '-an', '-y', '-passlogfile ' + logPath])
                        .outputFormat("webm")
                        .output("/dev/null")
                        .on('end', function () {
                            resolve(Buffer.from(''));
                        })
                        .on('error', function (err, stdout, stderr) {
                            console.log('ffmpeg process video convert pass1 an error happened: ' + err.message);
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            resolve(Buffer.from(''));
                        })
                        .run();

                } catch (e) {
                    console.error(e);
                    resolve(Buffer.from(''));
                }
            })
                .then(() => {
                    //ffmpeg -i "$1" -b:v 0 -crf 30 -pass 1 -an -f webm -y /dev/null
                    //ffmpeg -i "$1" -b:v 0 -crf 30 -pass 2 "${1%.mp4}.webm"
                    let totalTime = 0;
                    return new Promise(async resolve => {
                        try {
                            ffmpeg(inputFile, { logger: console })
                                .inputFormat(dokeBoss.getExtensionByMimeType(this.bufferMimeType))
                                .outputOptions(['-b:v 0', '-crf 30', '-pass 2', '-passlogfile ' + logPath])
                                .outputFormat("webm")
                                .output(outputFile)
                                .on('end', function () {
                                    resolve(true);
                                })
                                .on('codecData', data => {
                                    // HERE YOU GET THE TOTAL TIME
                                    totalTime = parseInt(data.duration.replace(/:/g, ''))
                                })
                                .on('progress', progress => {
                                    // HERE IS THE CURRENT TIME
                                    const time = parseInt(progress.timemark.replace(/:/g, ''))

                                    // AND HERE IS THE CALCULATION
                                    const percent = (time / totalTime) * 100

                                    //console.log(percent)
                                })
                                .on('error', function (err, stdout, stderr) {
                                    console.log('ffmpeg process video convert pass2 an error happened: ' + err.message);
                                    console.log('stdout: ' + stdout);
                                    console.log('stderr: ' + stderr);
                                    resolve(false);
                                })
                                .run();

                        } catch (e) {
                            console.error(e);
                            resolve(false);
                        }
                    })
                })
        } else {
            process = await new Promise(res => {

                ffmpeg(inputFile, { logger: console })
                    .inputFormat(dokeBoss.getExtensionByMimeType(this.bufferMimeType))
                    .outputOptions(options.videoStreamable ? ['-movflags', 'faststart'] : [])
                    .output(outputFile)
                    .outputFormat(dokeBoss.getExtensionByMimeType(mimeType))
                    .on('end', function () {
                        res(true);
                    })
                    .on('error', function (err, stdout, stderr) {
                        console.log('ffmpeg convert error: ' + err.message);
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        res(false);
                    })
                    .run()
            });
        }

        return this.fileContent(outputFile)
    }

}