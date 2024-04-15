import type { Client, ClientEvent, Room, RoomEvent, Request } from "./Bridge";
import server from "./Server";

export default class ClientManager {

    eventLoopSleep: number = 1000;
    eventLoopRunning: boolean = false;

    last_client_event_id: number = -1;
    client_events: ClientEvent[] = [];

    room: Room;
    client_id: number;

    clientEventHandler: () => void = () => {};

    error_handler: (error: any) => void = (error) => {
        console.error(error);
    }

    constructor(room: Room, client_id: number) {
        this.room = room;
        this.client_id = client_id;
    }

    addClientEvents(events: ClientEvent[]) {
        if (events.length == 0) { return; }
        this.client_events = this.client_events.concat(events);
        this.last_client_event_id = events[events.length - 1].id;
        this.clientEventHandler();
    }

    async sync() {
        let data;

        try {
            data = await server.post("/user/getevents", {
                watch_code: this.room.watch_code,
                client_id: this.client_id,
                last_client_event_id: this.last_client_event_id
            });

            this.addClientEvents(data.client_events ?? []);

        } catch (e) {
            this.error_handler(e);
        }
    }

    async eventLoop() {
        while (this.eventLoopRunning) {
            await this.sync();
            await new Promise(resolve => setTimeout(resolve, this.eventLoopSleep));
        }
    }

    start() {
        this.eventLoopRunning = true;
        this.eventLoop();
    }

    stop() {
        this.eventLoopRunning = false;
    }
}