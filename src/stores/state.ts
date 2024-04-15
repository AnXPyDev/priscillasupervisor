import type { Room } from "@/lib/Bridge";
import { defineStore } from "pinia";

interface State {
    loading: number
    room?: Room
    error?: string
}

export const useState = defineStore('state', {
    state: (): State => ({
        loading: 0,
        room: undefined,
        error: undefined
    })
});

export type StateStore = ReturnType<typeof useState>;