import type User from "@/lib/User";
import { defineStore } from "pinia";

interface State {
    auth: boolean
    session?: string
    user?: User
};

export const useAuth = defineStore('auth', {
    state: (): State => ({
        auth: false,
        session: undefined,
        user: undefined
    })
});