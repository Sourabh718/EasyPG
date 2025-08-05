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
        oldInput:{username:"", email:"",userType:"", terms:""},
        user:{},
    });
}
    exports.postSignup = (req,res,next)=>{
        const {username, email, password, userType, terms} =req.body;
        
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
            const user = new User({username, email, password:hashPassword, userType});
            return user.save().then(()=>{
            res.redirect('/login');;
        });
        }).catch(err=>{
                return res.status(422).render('auth/signup', {
                pageTitle:'SignUp',
                isLoggedIn:false, 
                errors:[err.message], 
                oldInput:{username:"", email:"",userType:"", terms:""},
                user:{},
            });
        });

        // const user = new User({username, email, password, userType});
        // // user.save().then(()=>{
        // //     res.redirect('/home-list')
        // // })
        // // .catch(errors=>{
        // //     console.log('error',errors)
        // //     res.redirect('/signup')
        // // })
}

// exports.postSignup =
// [
//     check('username')
//         .trim()
//         .isLength({min:2})
//         .withMessage('username should be atleast 2 character')
//         .matches(/^[A-Za-z\s]+$/)
//         .withMessage('name should contaion only alphabet'),
    
//         check('email')
//         .isEmail()
//         .withMessage('enter a valid email')
//         .normalizeEmail(),
    
//         check('password')
//         .isLength({min:1})
//         .withMessage('password should be atleast 8 character'),
    
//         check('confirmPassword')
//         .trim()
//         .custom((value, {req})=>{
//             if(value !== req.body.password){
//                 throw new Error('password do not match')
//             }
//             return true;
//         }),
    
//         check('terms')
//         .notEmpty()
//         .withMessage('you should accept the terms and condition')
//         .custom(value=>{
//             if(value !== "on"){
//                 throw new Error('you should accept the terms and condition')
//             }
//             return true;
//         }),
        


// exports.postSignup =(req,res,next)=>{
//         const {username, email, password} =req.body;
        
//         const errors = validationResult(req);
//         if(!errors.isEmpty()){
//             return res.status(422).render('auth/signup',{
//                 pageTitle:'sigup',
//                 isLoggedIn:false,
//                 errors:errors.array().map(err=>err.msg),
//                 oldInput:{username, email, password}
//             });
//         }
//     res.redirect('/home-list')
// }
