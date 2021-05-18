import { IncomingMessage, ServerResponse } from 'http';

export interface IncomingMBody extends IncomingMessage {
  body: object;
}

export interface Routes {
  method: string;
  route: string;
  fn: (req: IncomingMBody, res: ServerResponse) => void;
}

export { Server, ServerResponse, IncomingMessage } from 'http';
