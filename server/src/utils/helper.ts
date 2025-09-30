import bcrypt from "bcrypt"

// Password Hashing Feature. 

const hashingPassword = async (plaintext: string) => {
    const saltRound = 12
    const hash = await bcrypt.hash(plaintext, saltRound);
    return hash;

}

const decryptPassword = async (plaintext: string, hashedPassword: string) => {
    return await bcrypt.compare(plaintext, hashedPassword)
}

const generateSixDigitCode = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
}



export { hashingPassword, decryptPassword, generateSixDigitCode }