import type { Client, ClientEvent, Room, RoomEvent, Request } from "./Bridge";
import server from "./Server";

export default class RoomManager {

    eventLoopSleep: number = 1000;
    eventLoopRunning: boolean = false;

    last_room_event_id: number = -1;
    room_events: RoomEvent[] = [];

    room: Room;

    clients: Client[] = [];


    roomEventHandler: () => void = () => {};
    clientHandler: () => void = () => {};

    error_handler: (error: any) => void = (error) => {
        console.error(error);
    }

    constructor(room: Room) {
        this.room = room;
    }

    addRoomEvents(events: RoomEvent[]) {
        if (events.length == 0) { return; }
        this.room_events = this.room_events.concat(events);
        this.last_room_event_id = events[events.length - 1].id;
        this.roomEventHandler();
    }

    setClients(clients: Client[]) {
        this.clients = clients;
        this.clientHandler();
    }

    async sync() {
        let data;

        try {
            data = await server.post("/user/getevents", {
                watch_code: this.room.watch_code,
                last_room_event_id: this.last_room_event_id,
            });

            this.addRoomEvents(data.room_events ?? []);

            data = await server.post("/user/getclients", {
                watch_code: this.room.watch_code
            });

            this.setClients(data.clients);
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