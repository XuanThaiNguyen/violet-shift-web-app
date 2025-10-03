import { EventEmitter } from "eventemitter3";

const authEventBus = new EventEmitter();

export const AUTH_EVENTS = {
    SESSION_EXPIRED: "session_expired",
}


export default authEventBus;