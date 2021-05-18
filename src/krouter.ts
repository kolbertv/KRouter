import * as http from 'http';

import { IncomingMBody, Routes, ServerResponse, Server } from './interfaces';

import { isObject } from './util';

class KRouter {
  private routes: Array<Routes>;
  private server: Server;

  get: (route: string, fn: (req: IncomingMBody, res: ServerResponse) => void) => this;
  post: (route: string, fn: (req: IncomingMBody, res: ServerResponse) => void) => this;
  constructor() {
    this.routes = [];
    this.server = http.createServer();

    this.get = this.add.bind(this, 'GET');
    this.post = this.add.bind(this, 'POST');
    this.handler = this.handler.bind(this);
  }

  private add(method: string, route: string, fn: (req: IncomingMBody, res: ServerResponse) => void) {
    this.routes.push({ method, route, fn });
    return this;
  }

  private handler(req: IncomingMBody, res: ServerResponse) {
    let jsonString = '';
    req.on('data', (data) => {
      jsonString += data;
    });
    req.on('end', () => {
      try {
        try {
          req.body = JSON.parse(jsonString.length > 0 ? jsonString : '{}');
        } catch (e) {
          throw { error: 'Bad Request', code: 400 };
        }
        const arr = this.routes.filter((element) => element.method === req.method && element.route === req.url);
        if (arr.length > 0) {
          arr[0].fn(req, res);
        } else throw { error: 'Not found', code: 404 };
      } catch (e) {
        if (!isObject(e)) e = { error: 'Internal Server Error', code: 500 };
        if (!e.code) {
          e.code = 500;
          if (!e.error) e.error = 'Internal Server Error';
        }

        res.writeHead(e.code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(e));
      }
    });
  }

  listen(port: number, fn: () => void) {
    this.server.on('request', this.handler);
    this.server.listen(...arguments);
    return this;
  }
}

export { KRouter };
