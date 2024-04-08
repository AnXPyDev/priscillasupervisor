import { defineStore } from "pinia";

interface State {
    server_url?: string
}

export const useConfiguration = defineStore('configuration', {
    state: (): State => ({
        server_url: undefined
    })
});