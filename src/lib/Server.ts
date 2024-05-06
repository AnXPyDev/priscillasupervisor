import { useAuth } from "@/stores/auth";
import { useConfiguration } from "@/stores/configuration";
import type { Axios, AxiosResponse } from "axios";
import axios from "axios";
import { createConnection, type Connection } from "./Connection";

type Configuration = ReturnType<typeof useConfiguration>;
type Auth = ReturnType<typeof useAuth>;

export class Server {
    configuration!: Configuration;
    auth!: Auth;
    features!: any;

    connection!: Connection; 

    async init(configuration: Configuration, auth: Auth) {
        this.configuration = configuration;
        this.auth = auth;

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
            session: this.auth.session,
            ...data
        };
    }

    assert(res: AxiosResponse) {
        if (res.data.code != 0) {
            throw new Error(res.data.message);
        }
    }

    async post(endpoint: string, data: object = {}) {
        const res = await this.connection.post(endpoint, this.withSession(data));
        this.assert(res);
        return res.data;
    }

    async connect() {
        this.connection = createConnection({ url: this.configuration.server_url!! });

        this.features = await this.post("/info/features");
    }
    


    async getInfo() {
        const data = await this.post("/user/info");

        this.auth.user = {
            id: data.id,
            username: data.username,
            displayname: data.displayname
        };
    }

    async restore() {
        await this.getInfo();
        this.auth.auth = true;
    }

    async login(username: string, password: string) {
        const data = await this.post("/user/login", { username, password });

        this.auth.auth = true;
        this.auth.session = data.session!!;

        console.log(data);

        await this.restore();
    }

    async logout() {
        const data = await this.post("/user/logout");

        this.auth.auth = false;
        this.auth.session = undefined;
        this.auth.user = undefined;
    }

    async createRoom(options: {
        name?: string,
        config: string,
    }) {
        return await this.post("/user/createroom", {
            name: options.name != "" && options.name || undefined,
            config: options.config
        });
    }
    
    async getRooms() {
        return await this.post("/user/getrooms");
    }
};

export default new Server();