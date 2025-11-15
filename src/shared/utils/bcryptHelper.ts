import bcrypt from 'bcrypt';

export const hashPassword = async(password : string) : Promise<string> =>{
      const saltRound = 10;
      const hashPassword = await bcrypt.hash(password,saltRound);
      return hashPassword
}

export const comparePassword = async(password : string, userPassword : string) : Promise<boolean>=>{
    console.log(password,userPassword,"-->passs")
    return await bcrypt.compare(password,userPassword)
}