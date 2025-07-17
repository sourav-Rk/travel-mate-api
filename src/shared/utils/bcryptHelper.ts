import bcrypt from 'bcrypt';

export const hashPassword = async(password : string) : Promise<string> =>{
      const saltRound = 10;
      const hashPassword = await bcrypt.hash(password,saltRound);
      return hashPassword
}

export const comparePassword = async(password : string, userPassword : string) : Promise<boolean>=>{
    return await bcrypt.compare(password,userPassword)
}