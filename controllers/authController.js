const { validationResult, check } = require("express-validator");
const User = require("../models/user");
const bcrypt  = require("bcryptjs");
const user = require("../models/user");
exports.getLogin = (req,res,next)=>{
    // req.isLoggedIn = false;
    res.render('auth/login',{
        pageTitle: 'login',
        editing: false,
        isLoggedIn: false,
        errors: [], 
        oldInput:{email:"", password:""},
        user:{}
    });
};
exports.postLogin = async (req,res,next)=>{
    const {email, password} = req.body; // this is from login page
    const user = await User.findOne({email});
    if(!user){
        return res.status(422).render('auth/login',{
                pageTitle:'sigup',
                isLoggedIn:false,
                errors: ['Incorrect Email'],
                oldInput:{email,password},
                user:{}
            });
    }
    const matchPassword = await bcrypt.compare(password, user.password)
    if(!matchPassword){
        return res.status(422).render('auth/login',{
                pageTitle:'sigup',
                isLoggedIn:false,
                errors: ['Incorrect Password'],
                oldInput:{password,email},
                user:req.session.user
            });
    }
    req.session.user = user;
    await req.session.save();
    req.session.isLoggedIn=true;
    res.redirect('/')
};
exports.postLogout =(req,res,next)=>{
    // res.cookie("isLoggedIn", false);
    req.session.destroy(()=>{        
        res.redirect('/login');
    });
};

exports.getSignup =(req,res,next)=>{
    res.render('auth/signup', {pageTitle:'SignUp',
        isLoggedIn:false, 
        errors:[], 
        oldInput:{username:"", email:"",userType:"", terms:"",mobileNo:""},
        user:{},
    });
}
    exports.postSignup = (req,res,next)=>{
        const {username, email, password, userType, terms,mobileNo} =req.body;
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).render('auth/signup',{
                pageTitle:'sigup',
                isLoggedIn:false,
                errors:errors.array().map(err=>err.msg),
                oldInput:{username, email, userType, terms},
                user:{}
            });
        }
        bcrypt.hash(password,1).then(hashPassword => {
            const user = new User({username, email, password:hashPassword, userType, mobileNo});
            return user.save().then(()=>{
            res.redirect('/login');;
        });
        }).catch(err=>{
                return res.status(422).render('auth/signup', {
                pageTitle:'SignUp',
                isLoggedIn:false, 
                errors:[err.message], 
                oldInput:{username:"", email:"",userType:"", terms:"", mobileNo:""},
                user:{},
            });
        });
}
