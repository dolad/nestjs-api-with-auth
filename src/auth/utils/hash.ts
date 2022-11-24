import { scrypt, randomBytes, createHash } from "crypto";

import { promisify } from "util";
import * as bcrypt from 'bcrypt';

export class HashManager {
    // expensive hashing in term of memory-optimization
    async hash(payload:string): Promise<string> {
        const salt = randomBytes(8).toString('hex');
        const buffer = await this.bufferedPassword(payload, salt);
        return `${buffer.toString('hex')}.${salt}`
    }

    async bHash(payload: string): Promise<string>{
        return bcrypt.hashSync(payload, 10);
    }

    async bCompare(password:string, newPassword:string) : Promise<boolean> {
        return await bcrypt.compare(password, newPassword)
    }

    private async bufferedPassword(password:string, salt:string) : Promise<Buffer> {
        const response = await promisify(scrypt)(password,salt,64)
        return response as Buffer
    }

    async compare(payload: string, newPayload: string): Promise<boolean>{
        const [hashPassword, salt] = payload.split(',');
        const buffer = await this.bufferedPassword(newPayload, salt)
        return buffer.toString('hex') === hashPassword
    }

    createToken(){
        const generatedToken = randomBytes(32).toString('hex');
        return createHash('sha256').update(generatedToken).digest('hex')
    }

}

