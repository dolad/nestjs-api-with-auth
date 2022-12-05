import { scrypt, randomBytes, createHash } from "crypto";

import { promisify } from "util";
import * as bcrypt from 'bcrypt';

export class HashManager {
    // expensive hashing in term of memory-optimization
    async bHash(payload: string): Promise<string>{
        return bcrypt.hashSync(payload, 10);
    }

    async bCompare(password:string, newPassword:string) : Promise<boolean> {
        return bcrypt.compareSync(newPassword,password)
    }



}

