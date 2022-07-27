import bcrypt from 'bcrypt';

async function generatePassword (password: string): Promise<String>{
    const hash : string = await bcrypt.hash(password, 10);

    return hash;
}

async function verifyPassword(password: string, hashPassword: string): Promise<boolean>{
    const result: boolean = await bcrypt.compare(password, hashPassword);

    return result;
}

module.exports = {
    generatePassword,
    verifyPassword
}