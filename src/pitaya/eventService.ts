import mitt from 'mitt';
import type { Handler } from 'mitt';

export type EventHandler<T> = Handler<T>;
const emitter = mitt();

class EventService {
  publish(eventName: string, args?: unknown) {
    return emitter.emit(eventName, args);
  }

  subscribe(eventName: string, handler: Handler<unknown>) {
    return emitter.on(eventName, handler);
  }

  unsubscribe(eventName: string, handler: Handler<unknown>) {
    return emitter.off(eventName, handler);
  }
}

export const eventService = new EventService();
