import bcrypt from 'bcrypt';

export async function generatePassword (password: string): Promise<string>{
    const hash : string = await bcrypt.hash(password, 10);

    return hash;
}

export async function verifyPassword(password: string, hashPassword: string): Promise<boolean>{
    const result: boolean = await bcrypt.compare(password, hashPassword);

    return result;
}
