import bcrypt from 'bcrypt'
const user = [
    {
        name:"Israel",
        email:"c24.e.israel.luna@gmail.com",
        confirmado:1,
        password: bcrypt.hashSync('password',10)
    },
    {
        name:"itzel",
        email:"itzel@gmail.com",
        confirmado:1,
        password: bcrypt.hashSync('password',10)
    }

]
export default user;