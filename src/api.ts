#!/usr/bin/env node
const express = require('express');
const fileUpload = require('express-fileupload');
import fs from 'fs';
import dokeBoss from '.';
import fg from 'fast-glob';

export class dokeBossApi {
    app: typeof express;
    server: any;
    constructor() {

        process.on('SIGINT', () => {
            this.stop();
        });

        process.on('SIGTERM', () => {
            this.stop();
        });

        process.on('message', (msg) => {
            if (msg === 'shutdown') {
                this.stop();
            }
        });

        process.on('exit', async () => {
            await this.stop();
        });
        process.on('SIGUSR1', async () => {
            await this.stop();
        });
        process.on('SIGUSR2', async () => {
            await this.stop();
        });

        try {
            fs.mkdirSync('./api/files', { recursive: true });
        } catch (e) {

        }
        //remove old files from path
        this.removeOldFiles();

        this.app = express();

        const host = process.env.DOKEBOSS_API_HOST || '127.0.0.1';
        const port = process.env.DOKEBOSS_API_PORT || 5001;
        const fileSize = process.env.DOKEBOSS_API_FILESIZE || 1024 * 1024 * 1024;
        this.app.use(express.json());
        this.app.use(fileUpload({
            limits: { fileSize },
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
            debug: process.env.DOKEBOSS_API_FILEUPLOAD_LOG || false,
            uploadTimeout: process.env.DOKEBOSS_API_FILEUPLOAD_TIMEOUT || 120000,
            logger: {
                log: (message) => {
                    if (process.env.DOKEBOSS_API_FILEUPLOAD_LOG)
                        fs.writeFileSync(process.env.DOKEBOSS_API_FILEUPLOAD_LOG_FILE ?? '/tmp/fileupload.log', message, { flag: 'a+', encoding: 'utf8' });
                }
            }
        }));

        this.app.post('/upload', async function (req, res) {

            console.log('request new', req.body, req.files?.length)

            if (!req.body.type || !['convert', 'preview'].includes(req.body.type)) {
                return res.status(400).send({ error: 'Invalid type' });
            }

            if (!req.body.outputMimeType || !dokeBoss.getExtensionByMimeType(req.body.outputMimeType)) {
                return res.status(400).send({ error: 'Invalid outputMimeType' });
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send({ error: 'No files were uploaded.' });
            }

            let file = req.files.file;
            let content = fs.readFileSync(file.tempFilePath, { encoding: 'binary' });
            let uploadId = require('crypto')
                .createHash('sha256')
                .update(content)
                .update(req.body.options ?? "")
                .digest('hex');
            let uploadPath = './api/files/' + uploadId + "." + dokeBoss.getExtensionByMimeType(file.mimetype);

            console.log('uploadId', uploadId);
            try {
                fs.writeFileSync("./api/files/convert-" + uploadId + ".json", JSON.stringify(req.body));
                fs.writeFileSync(uploadPath, content, { encoding: 'binary' });
            } catch (e) {
                console.log('write source file error', e);
            }

            let convertPath = './api/files/[converted]' + uploadId + "." + dokeBoss.getExtensionByMimeType(req.body.outputMimeType);
            try {
                const doke = dokeBoss
                    .from(file.tempFilePath, file.mimetype)
                    .to(convertPath, { mimeType: req.body.outputMimeType });

                const data = await doke[req.body.type](JSON.parse(req.body.options || "{}"));
                const readableStream = fs.createReadStream(convertPath, { highWaterMark: 16 * 1024 });
                res.setHeader("content-type", req.body.outputMimeType);
                readableStream.pipe(res);
            } catch (e) {
                console.log('convert error', e);
                return res.status(500).send(e);
            }

        });

        this.app.get('/ping', async function (req, res, next) {
            return res.json({ result: true });
        });

        this.app.post('/check', async function (req, res, next) {
            console.log('request new check', req.body, req.files?.length)

            if (!req.body.method || !['isStreamable'].includes(req.body.method)) {
                return res.status(400).send({ error: 'Invalid method' });
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send({ error: 'No files were uploaded.' });
            }

            let file = req.files.file;
            let content = fs.readFileSync(file.tempFilePath, { encoding: 'binary' });
            let uploadId = require('crypto')
                .createHash('sha256')
                .update(content)
                .update(req.body.options ?? "")
                .digest('hex');
            let uploadPath = './api/files/' + uploadId + "." + dokeBoss.getExtensionByMimeType(file.mimetype);

            console.log('uploadId', uploadId);
            try {
                fs.writeFileSync("./api/files/convert-" + uploadId + ".json", JSON.stringify(req.body));
                fs.writeFileSync(uploadPath, content, { encoding: 'binary' });
            } catch (e) {
                console.log('write source file error', e);
            }

            const doke = dokeBoss
                .from(file.tempFilePath, file.mimetype);
            try {
                const response = await doke[req.body.method]();
                console.log(response)
                return res.json({ result: response });
            } catch (e) {
                console.log('error', e);
                return res.status(500).json({ result: false });
            }
        });

        this.app.get('/download', function (req, res) {
            const convertId = req.query.id;
            let convert;

            try {
                let convertFileContent = fs.readFileSync('./api/files/convert-' + convertId + '.json', 'utf8');
                convert = JSON.parse(convertFileContent);
            } catch (e) { }

            if (!convert || !convertId) {
                return res.status(404).send('Not found');
            }

            const filePath = convertId + '.' + dokeBoss.getExtensionByMimeType(convert.outputMimeType);
            const readableStream = fs.createReadStream("./api/files/" + filePath, { highWaterMark: 16 * 1024 });
            res.setHeader("content-type", convert.outputMimeType);
            readableStream.pipe(res);
        });

        this.server = this.app.listen(port, host, () => {
            console.log(`Server is running on port ${port}`);
        });

    }
    async removeOldFiles() {
        const entries = await fg('./api/files/*', { dot: true });
        for (let file of entries) {
            await new Promise(async resolve => {
                fs.rm(file, () => {
                    resolve(1);
                });

            });
        }

        return true;
    }
    stop() {
        this.server.close(() => {
            process.exit(0);
        });
    }

}

new dokeBossApi();