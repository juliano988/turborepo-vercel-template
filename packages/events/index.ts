import { FILE_ADDED } from "./events/file.added";
import { USER_CREATED } from "./events/user.created";
import type { FileAddedPayload } from "./events/file.added";
import type { UserCreatedPayload } from "./events/user.created";

export { USER_CREATED };
export type { UserCreatedPayload };

export { FILE_ADDED };
export type { FileAddedPayload };

export type EventPayloadMap = {
  [USER_CREATED]: UserCreatedPayload;
  [FILE_ADDED]: FileAddedPayload;
};

export type EventName = keyof EventPayloadMap;
