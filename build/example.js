"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const port = 8000;
const http = new index_1.KRouter();
http.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ text: 'We have GET test API!' }));
});
http.post('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ text: 'We have POST test API!' }));
});
http.listen(port, () => {
    console.log('Server started');
});
