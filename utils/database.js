// require('dotenv').config();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const password = encodeURIComponent('root');
// const mongoUrl = process.env.MONGO_URI;
// const mongoUrl = `mongodb+srv://sourabhtripathi718:${password}@cluster0.rc5jobe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const mongoUrl = "mongodb://localhost:27017/findMyStay";

let _db;
const mongoConnect = (callback)=>{
    MongoClient.connect(mongoUrl)
    .then(client=>{
        console.log("mongodb is connected");
        _db=client.db('findMyStay');
        callback();
    })
    .catch((error)=>{
        console.log('error while connecting',error);
    });
}
const getDb=()=>{
  if(!_db)
    throw new Error("Mongo not connected2");
  return _db;
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.mongoUrl = mongoUrl;