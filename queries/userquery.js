const getUser="SELECT * FROM users";
const userRegister='INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
const getSingleUser="SELECT * FROM users WHERE username = $1";

module.exports={
    getUser,
    userRegister,
    getSingleUser
}