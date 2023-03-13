
import { UserSession } from "src/storage/postgres/user-session.schema";
import { USER_SESSION } from "../../utils/constants";

export const userSessionProvider = {
    useValue: UserSession,
    provide: USER_SESSION,
}
