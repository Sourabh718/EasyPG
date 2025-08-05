const express=require('express');
const authRouter=express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

authRouter.get("/login", authController.getLogin);
authRouter.post("/login",authController.postLogin);
authRouter.post("/logout",authController.postLogout);
authRouter.get("/signup",authController.getSignup);
// authRouter.post('/signup',authController.postSignup);
authRouter.post('/signup', [
     check('username')
    .trim()
    .isLength({min:2})
    .withMessage('username should be atleast 2 character')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('name should contaion only alphabet'),

    check('email')
    .isEmail()
    .withMessage('enter a valid email')
    .normalizeEmail(),

    check('password')
    .isLength({min:1})
    .withMessage('password should be atleast 8 character'),
    
    check('confirmPassword')
    .trim()
    .custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('password do not match')
        }
        return true;
    }),

    check('terms')
    .notEmpty()
    .withMessage('you should accept the terms and condition')
    .custom(value=>{
        if(value !== "on"){
            throw new Error('you should accept the terms and condition')
        }
        return true;
    }),
],
authController.postSignup);

exports.authRouter=authRouter;