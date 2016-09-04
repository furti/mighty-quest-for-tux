import { HotkeyHandler } from './HotkeyHandler';
import { Key } from './Key';

let registeredHandlers: { [key: number]: HotkeyHandler[] } = {};

export class Hotkeys {
    /**
     * Register a handler for a key. When the key is pressed the handler will be called.
     * @param {Key} key The key to listen for
     * @param {KeyboardEvent} handler Function that is called when the key is pressed.
     * @return {boolean} return false if no further handlers should be called.
     */
    public static registerHotkey(key: Key, handler: HotkeyHandler): void {
        if (!registeredHandlers[key]) {
            registeredHandlers[key] = [];
        }

        registeredHandlers[key].push(handler);
    }
}

document.addEventListener('keydown', function (event: KeyboardEvent) {
    if (!registeredHandlers[event.keyCode]) {
        return;
    }

    for (let handler of registeredHandlers[event.keyCode]) {
        if (!handler(event)) {
            return;
        }
    }
});
