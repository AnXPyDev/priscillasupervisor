export interface Room {
    id: number
    name: string
    join_code: string
    watch_code: string
}

export enum Severity {
    DEBUG = -3,
    MESSAGE_RECEIVED = -2,
    SPECIAL_INFO = -1,
    INFO, WARNING, SEVERE, BREACH
};

export interface Client {
    id: number
    name: string
    room_id: number
    state: string
    ip_address: string
}

export interface ClientEvent {
    id: number
    client_id: number
    created: string
    data: string
}

export interface ClientState {
    locked: boolean
    warning: boolean
    disconnected: boolean
    debug: true
}

export interface RoomEvent {
    id: number
    created: string
    data: string
}

export interface Request {
    id: number
    client_id: number
    data: string
}

export interface Response {
    request_id: number
    data: string
}