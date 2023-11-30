import { EventEmitter } from "node:events";
import WebSocket, { RawData } from "ws";
import { v4 as uuid } from "uuid";
import xmlparser from "xml-parser";
import HandleOpen from "../root/HandleOpen";
import log from "../../utils/log";
import HandleAuth from "../root/HandleAuth";
import HandleIQ from "../root/HandleIQ";
import HandleMessage from "../root/HandleMessage";

export default class XmppClient extends EventEmitter {
  public jid: string;
  public socket: WebSocket;
  public accountId: string;
  public Authenticated: boolean;
  public ConnectedToParty: boolean;
  private uuid: string;
  public sender?: string;

  constructor(ws: WebSocket) {
    super();

    this.jid = "";
    this.socket = ws;
    this.accountId = "";
    this.Authenticated = false;
    this.ConnectedToParty = false;
    this.sender = "";
    this.uuid = uuid();

    this.socket.on("message", async (message: RawData | string) => {
      if (Buffer.isBuffer(message)) message = message.toString();

      const parsedMessage = xmlparser(message as string);

      if (!parsedMessage || !parsedMessage.root || !parsedMessage.root.name)
        return log.error(
          `WebSocket Error: ${JSON.stringify(parsedMessage)}`,
          "XmppClient"
        );

      const { root } = parsedMessage;

      switch (root.name) {
        case "open":
          console.debug(root.name);
          this.Open();
          break;
        case "auth":
          console.debug(root.name);
          this.Auth(root);
          break;
        case "iq":
          console.debug(root.name);
          this.IQ(root);
          break;
        case "message":
          console.debug(root.name);
          this.Message(root);
          break;
        case "presence":
          console.debug(root.name);
          break;
      }
    });
  }

  Open() {
    HandleOpen(this.socket, this.uuid, this.Authenticated);
  }

  Auth(parsedMessage: xmlparser.Node) {
    HandleAuth(
      this.socket,
      this,
      this.accountId,
      this.Authenticated,
      parsedMessage
    );
  }

  IQ(parsedMessage: xmlparser.Node) {
    HandleIQ(this.socket, this.accountId, this.jid, parsedMessage);
  }

  Message(parsedMessage: xmlparser.Node) {
    HandleMessage(this.socket, this.jid, parsedMessage);
  }
}
