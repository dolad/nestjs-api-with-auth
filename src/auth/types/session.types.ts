import { UserSessionAttributes } from "../../storage/postgres/user-session.schema";

export type SessionTypeParams = Omit<UserSessionAttributes , 'id'>
