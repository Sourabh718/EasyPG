// core module
const path = require('path');
const express=require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
const session = require('express-session')
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const MongoDBStore  = require('connect-mongodb-session')(session);

// external module 
const userRouter=require('./routes/userRouter');
const {hostRouter}=require('./routes/hostRouter');
const rootDir = path.dirname(require.main.filename);
const hostController = require('./controllers/hostController');
const {mongoConnect, mongoUrl} = require('./utils/database');
const { authRouter } = require('./routes/authRouter');
const Home = require('./models/homes');

app.use(express.urlencoded());
app.use(express.static(path.join(rootDir,'public')))
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/host/uploads', express.static(path.join(rootDir,'uploads')));
app.use('/user/uploads', express.static(path.join(rootDir, 'uploads')));

const randomString = (length)=>{
    const char = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for(let i=0;i<length;i++){
        result += char.charAt(Math.floor(Math.random() * char.length));
    }
    return result;
}
const storage =multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null, randomString(10) + '-' + file.originalname)
    }
})
const multerOption = {
    storage,
}
app.use(multer(multerOption).single('photoUrl'))
const store = new MongoDBStore({
    uri: mongoUrl,
    collection: 'sessions'
});
app.use(session({
    secret:'this is my session',
    resave:false,
    saveUninitialized:true,
    store,
}));
app.use((req,res,next)=>{
    next();             
});
app.use(authRouter)
app.use("/host",(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
});
app.use("/user",(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
});

app.use((req,res,next)=>{
    req.isLoggedIn = req.session.isLoggedIn;
    next();
})
app.get('/',(req,res,next)=>{
    
    Home.fetchAll().then(registeredHome=>{
        res.render('store/index',{registeredHome, pageTitle:'EasyPG', isLoggedIn: req.isLoggedIn, user:req.session.user});
    });
});
app.use('/user',userRouter);
app.use("/host",hostRouter);
app.use(hostController.goTo404);


// database connection
const PORT=3000;
mongoConnect(() => {
    app.listen(PORT,()=>{
        console.log(`server: http://localhost:${PORT}`); 
    });
});
mongoose.connect(mongoUrl)
    .then(() => console.log('Mongoose connected '))
    .catch(err => console.error('Mongoose connection error:', err));
