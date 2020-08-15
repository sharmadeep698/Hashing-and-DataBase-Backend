require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require ("ejs")
// const bcrypt = require('bcrypt');
const session = require('express-session')
// const saltRounds = 10
// const md5 = require('md5');
const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
const app = express(); 	
mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser: true,  useUnifiedTopology: true })

const userSchema  = new mongoose.Schema({
  name: String,
  password:String
});
// userSchema.plugin(encrypt, { secret:process.env.SECRETS,encryptedFields: ['password']});
const User = new mongoose.model('User',userSchema);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
	res.render("home.ejs");
});
app.get("/login",function(req,res){
	// console.log("we are here ")
	res.render("login.ejs")
	});
app.get("/register",function(req,res){
	res.render("register.ejs")
})
app.post("/register",function(req,res){
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
	   if(err){console.log(err)}
	const newUser = new User({
	name:req.body.username,
	password:hash
})
newUser.save((err)=>{
	if(err){console.log(err)}else{res.render("secrets.ejs")}
})
});

});
app.post("/login",(req,res)=>{
	const {username,password} = req.body
	User.find({name:username},function(error,resultName){
		if (resultName) {
		bcrypt.compare(password, resultName[0].password, function(err, result) {
    		if(result){res.render("secrets.ejs")} else{console.log("err in finding password"+err)}
				});
    		}
			if(error){console.log("error"+error)}
})
})
app.listen(3000,function(){
	console.log("app started in port 3000")
})