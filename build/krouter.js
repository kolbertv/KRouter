"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KRouter = void 0;
const http = __importStar(require("http"));
const util_1 = require("./util");
class KRouter {
    constructor() {
        this.routes = [];
        this.server = http.createServer();
        this.get = this.add.bind(this, 'GET');
        this.post = this.add.bind(this, 'POST');
        this.handler = this.handler.bind(this);
    }
    add(method, route, fn) {
        this.routes.push({ method, route, fn });
        return this;
    }
    handler(req, res) {
        let jsonString = '';
        req.on('data', (data) => {
            jsonString += data;
        });
        req.on('end', () => {
            try {
                try {
                    req.body = JSON.parse(jsonString.length > 0 ? jsonString : '{}');
                }
                catch (e) {
                    throw { error: 'Bad Request', code: 400 };
                }
                const arr = this.routes.filter((element) => element.method === req.method && element.route === req.url);
                if (arr.length > 0) {
                    arr[0].fn(req, res);
                }
                else
                    throw { error: 'Not found', code: 404 };
            }
            catch (e) {
                if (!util_1.isObject(e))
                    e = { error: 'Internal Server Error', code: 500 };
                if (!e.code) {
                    e.code = 500;
                    if (!e.error)
                        e.error = 'Internal Server Error';
                }
                res.writeHead(e.code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(e));
            }
        });
    }
    listen(port, fn) {
        this.server.on('request', this.handler);
        this.server.listen(...arguments);
        return this;
    }
}
exports.KRouter = KRouter;
