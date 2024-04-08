import type Room from "@/lib/Room";
import { defineStore } from "pinia";

interface State {
    loading: number
    room?: Room
}

export const useState = defineStore('state', {
    state: (): State => ({
        loading: 0,
        room: undefined
    })
});