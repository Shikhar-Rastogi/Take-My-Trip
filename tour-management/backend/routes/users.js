const express = require('express');
const { deleteUser, getAllUser, getSingleUser, updateUser } =require( '../controllers/userController.js');

const router = express.Router();
const {verifyUser, verifyAdmin}=require("../utils/verifyToken.js")
//update 
router.put('/:id', verifyUser,updateUser);

//delete 
router.delete('/:id',verifyUser, deleteUser);

//set single 
router.get('/:id',verifyUser, getSingleUser);

//set all 
router.get('/', verifyAdmin, getAllUser);

module.exports = router; 