
/**
 * From:
 * https://raw.githubusercontent.com/sjmf/ng2-stompjs-demo/master/app/modules/stompjs.d.ts
 *
 * Also some others here: https://github.com/jmesnil/stomp-websocket/issues/61
 *
 */
declare module "stompjs" {

    export interface Client {
        heartbeat: any;
        connected:boolean;

        debug(...args: string[]);

        connect(...args: any[]);
        disconnect(disconnectCallback?: () => any, headers?: any);

        send(destination: string, headers?:any, body?: string);
        subscribe(destination: string, callback?: (message: Message) => any, body?: string);
        unsubscribe();

        begin(transaction: string);
        commit(transaction: string);
        abort(transaction: string);

        ack(messageID: string, subscription: string, headers?: any);
        nack(messageID: string, subscription: string, headers?: any);
    }

    export interface Message {
        command: string;
        headers: any;
        body: string;

        ack(headers?: any);
        nack(headers?: any);
    }

    export interface Frame {
        constructor(command: string, headers?: any, body?: string);

        toString(): string;
        sizeOfUTF8(s: string);
        unmarshall(datas: any);
        marshall(command: string, headers?, body?);
    }

    export interface Stomp {
        client: Client;
        Frame: Frame;

        over(ws: EventTarget):Client;
    }

    export var Stomp;
}
