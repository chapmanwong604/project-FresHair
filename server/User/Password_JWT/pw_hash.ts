import * as bcrypt from 'bcryptjs'

const SALT_ROUND = 10;

export async function hashPassword (plainPassword:string) {
    const hash = await bcrypt.hash(plainPassword,SALT_ROUND);
    return hash;
}

// hashPassword('123456').then(hash=>(
//     console.log(hash)
// ));

export async function checkPassword(plainPassword:string,hashPassword:string){
    const match = await bcrypt.compare(plainPassword,hashPassword);
    return match;
}