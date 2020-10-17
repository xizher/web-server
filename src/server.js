"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const http_1 = __importDefault(require("http"));
class Server {
    constructor(app, port) {
        this._app = app;
        this._setPort(port);
        this._createHttpServer();
    }
    _setPort(port) {
        this._port = this._normalizePort(port);
        this._app.set('port', port);
    }
    _normalizePort(value) {
        const port = parseInt(value.toString(), 10);
        if (isNaN(port)) {
            return value;
        }
        else if (port >= 0) {
            return port;
        }
        else {
            return false;
        }
    }
    _createHttpServer() {
        this._server = http_1.default.createServer(this._app);
        this._server.listen(this._port);
        this._server.on('error', this._onError);
        this._server.on('listening', () => this._onListening(this._server));
    }
    _onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof this._port == 'string'
            ? `Pipe ${this._port}`
            : `Port ${this._port}`;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    _onListening(server) {
        const addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        require('debug')('server:server')(`Listening on ${bind}`);
    }
}
exports.Server = Server;
