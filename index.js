import path from 'path';

class UrlParser {

    constructor() {
        this.params = {
            ip: undefined,
            cookies: [],
            method: undefined,
            path: undefined,
            pathParams: undefined,
            searchParams: undefined,
            hash: undefined,
            filePath: undefined,
            fileExt: undefined,
            contentType: undefined
        }
    };

    async getContentType(ext) {
        switch (ext) {
            case 'css': this.params.contentType = 'text/css'; break;
            case 'csv': this.params.contentType = 'text/csv'; break;
            case 'xml': this.params.contentType = 'text/xml'; break;
            case 'plain': this.params.contentType = 'text/plain'; break;
            case 'js': this.params.contentType = 'text/javascript'; break;
            case 'ico': this.params.contentType = 'image/x-icon'; break;
            case 'png': this.params.contentType = 'image/png'; break;
            case 'jpg': this.params.contentType = 'image/jpg'; break;
            case 'jpeg': this.params.contentType = 'image/jpg'; break;
            case 'gif': this.params.contentType = 'image/gif'; break;
            case 'webp': this.params.contentType = 'image/webp'; break;
            case 'svg': this.params.contentType = 'image/svg+xml'; break;
            case 'json': this.params.contentType = 'application/json'; break;
            case 'xml': this.params.contentType = 'application/xml'; break;
            case 'zip': this.params.contentType = 'application/zip'; break;
            case 'pdf': this.params.contentType = 'application/pdf'; break;
            case 'ogg': this.params.contentType = 'application/ogg'; break;
            default: this.params.contentType = 'text/html';
        }
    };
    /**
     * PARSE COOKIES RETURN JSON OBJECT
     */
    cookieParser(cookies) {
        let result = {};
        cookies.split(';').forEach(item => {
            item = item.split('=');
            result[item[0].trim()] = item[1].trim()
        });
        return result;
    };
    /**
     * PARSE HTTP REQUEST HEADERS
     */
    async parse(req) {
        let url = req.headers[':scheme'] + '://' + req.headers[':authority'] + req.headers[':path'];
        let parsedUrl = new URL(url);
        let filePath = process.cwd() + '/public' + parsedUrl.pathname;
        let fileExt = path.extname(filePath).slice(1);
        this.params.ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
        this.params.cookies = req.headers.cookie ? this.cookieParser(req.headers.cookie) : null;
        this.params.method = req.headers[':method'];
        this.params.path = parsedUrl.pathname;
        this.params.pathParams = parsedUrl.pathname.split('/').filter(item => { return item });
        this.params.filePath = filePath;
        this.params.fileExt = fileExt;
        this.params.searchParams = Object.fromEntries(new URLSearchParams(parsedUrl.search));
        this.params.hash = parsedUrl.hash;
        await this.getContentType(fileExt);
        return this.params;
    }
};
export default new UrlParser;