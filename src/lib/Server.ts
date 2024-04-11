import { useAuth } from "@/stores/auth";
import { useConfiguration } from "@/stores/configuration";
import type { Axios, AxiosResponse } from "axios";
import axios from "axios";

type Configuration = ReturnType<typeof useConfiguration>;
type Auth = ReturnType<typeof useAuth>;

export class Server {
    configuration!: Configuration;
    auth!: Auth;

    connection!: Axios; 

    async init(configuration: Configuration, auth: Auth) {
        this.configuration = configuration;
        this.auth = auth;

        console.log(this.configuration.server_url, this.auth.session);
        if (this.configuration.server_url && this.auth.session) {
            try {
                await this.connect();
                await this.restore();
            } catch (e) {
                console.log("failed to restore");
            }
        }
    }

    withSession(data: object = {}): object {
        return {
            session: this.auth.session!!,
            ...data
        };
    }

    assert(res: AxiosResponse) {
        if (res.data.code != 0) {
            throw new Error(res.data.message);
        }
    }

    async connect() {
        this.connection = axios.create({
            baseURL: this.configuration.server_url
        });

        await this.connection.post("/info/ping");
    }

    async getInfo() {
        const res = await this.connection.post("/user/info", this.withSession());
        this.assert(res);

        this.auth.user = {
            id: res.data.id,
            username: res.data.username,
            displayname: res.data.displayname
        };
    }

    async restore() {
        await this.getInfo();
        this.auth.auth = true;
    }

    async login(username: string, password: string) {
        const res = await this.connection.post("/user/login", { username, password });
        this.assert(res);

        this.auth.auth = true;
        this.auth.session = res.data.session!!;

        await this.restore();
    }

    async logout() {
        let res = await this.connection.post("/user/logout", this.withSession());
        this.assert(res);

        this.auth.auth = false;
        this.auth.session = undefined;
        this.auth.user = undefined;
    }

    async createRoom(options: {
        name?: string,
        config?: string
    }) {
        const res = await this.connection.post("/user/createroom", this.withSession({
            name: options.name != "" && options.name || undefined,
            config: options.config != "" && options.config || undefined
        }));
        this.assert(res);

        return res.data;
    }

    async getEvents(options: {
        watch_code: string,
        last_room_event_id?: number,
        last_client_event_id?: number,
        last_request_id?: number
    }) {
        const res = await this.connection.post("/user/getevents", this.withSession(options));
        this.assert(res);

        return res.data;
    }

    async getRooms() {
        const res = await this.connection.post("/user/getrooms", this.withSession());
        this.assert(res);

        return res.data;
    }


};

export default new Server();