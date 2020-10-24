import { Application } from 'express';
import http from 'http';

export class Server {

  private _app : Application;
  private _port : string;
  private _server : http.Server;

  constructor (app : Application, port : string | number) {
    this._app = app;
    this._setPort(port);
    this._createHttpServer();
  }

  private _setPort (port : string | number) : void {
    this._port = this._normalizePort(port);
    this._app.set('port', port);
  }

  private _normalizePort (value : string | number) : any {
    const port = parseInt(value.toString(), 10);
    if (isNaN(port)) {
      return value;
    } else if (port >= 0) {
      return port;
    } else {
      return false;
    }
  }

  private _createHttpServer () : void {
    this._server = http.createServer(this._app);
    this._server.listen(this._port);
    this._server.on('error', this._onError);
    this._server.on('listening', () => this._onListening(this._server))
  }

  private _onError (error : any) :void {
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

  private _onListening (server : http.Server) : void {
    const addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
      require('debug')('server:server')(`Listening on ${bind}`);
  }

}
