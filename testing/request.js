// Exercise the real Express middleware without binding a TCP port.
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';

export function client(app) {
  return (url, { method = 'GET', headers = {}, body } = {}) => new Promise((resolve, reject) => {
    const socket = new Socket();
    Object.defineProperty(socket, 'remoteAddress', { value: '127.0.0.1' });
    const req = new IncomingMessage(socket);
    req.method = method; req.url = new URL(url, 'http://test').pathname;
    req.headers = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
    if (body !== undefined) req.headers['content-length'] = String(Buffer.byteLength(body));
    const res = new ServerResponse(req);
    res.end = function(chunk) {
      resolve({ status: this.statusCode, headers: new Headers(this.getHeaders()),
        json: async () => JSON.parse(chunk?.toString() || 'null'),
        text: async () => chunk?.toString() || '' });
      return this;
    };
    req.on('error', reject);
    app.handle(req, res, reject);
    if (body !== undefined) req.push(body);
    req.push(null);
  });
}
