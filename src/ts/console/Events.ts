import { EventHandler } from './EventHandler';

import { Logger } from './Logger';

export class Events {
    private eventHandlers: { [event: string]: EventHandler[] } = {};

    /**
     * Fires all registered Event handlers in the chain.
     * @param {string} eventName the event to fire.
     * @param {any} event the parameters that are supplied to the event
     */
    public fire(eventName: string, data?: any): void {
        if (!this.eventHandlers[eventName]) {
            Logger.debug('Events', `No event handler for ${eventName} registered.`);
            return;
        }

        this.eventHandlers[eventName].forEach((eventHandler) => {
            Logger.debug('Events', 'Calling event handler %o with data %o.', eventHandler, data);
            eventHandler(data);
        });
    }

    /**
     * Register a event handler for the given event.
     * Multiple event handlers can be registered for a single event. They will be called in the order they where registered.
     * @param {string}       event   the event
     * @param {EventHandler} handler the handler function
     */
    public on(event: string, handler: EventHandler): void {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }

        this.eventHandlers[event].push(handler);

        Logger.debug('Events', `Event handler %o for ${event} registered.`, handler);
    }
}