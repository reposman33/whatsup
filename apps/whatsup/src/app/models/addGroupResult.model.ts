import { Group } from "./group.model";

export type AddGroupResult = {
  group: Group;
  failedEmails: string[];
}