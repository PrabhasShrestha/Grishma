const createUsers = (req,res) => {
    res.send("User Created")

}

const LoginUsers = (req, res) => {
    res.send("user logged in")
}

const Viewprofile = (req, res) => {
    res.send("profile viewed")
}

const changepassword = (req, res) => {
    res.send("user password changed")
}



module.exports = {
    createUsers,LoginUsers,Viewprofile,changepassword
}