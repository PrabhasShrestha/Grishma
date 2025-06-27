const router = require('express').Router();
const { createUsers, updateUsers, deleteUsers, getAllUsers, getUsers, loginUser } = require('../controller/testController');
const fileUpload = require ('../middleware/multer');
const authGuard = require('../middleware/authguard');
const isAdmin = require('../middleware/isAdmin');

router.post("/createUsers",fileUpload("image"),createUsers);

router.post("/loginUser", loginUser);
router.put("/updateUsers/:id", updateUsers);
router.delete("/deleteUsers/:id", deleteUsers);
router.get("/getAllUsers",authGuard,isAdmin,getAllUsers); // here authguard,getAllUsers for token thing
router.get("/getUsers/:id",getUsers);

module.exports = router;
