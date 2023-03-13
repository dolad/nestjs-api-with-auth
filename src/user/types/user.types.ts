import { Session } from "express-session"

export interface IAuthUser {
    email: string,
    userId: string
}

export type UserSession = Session & Record<'user', any>
