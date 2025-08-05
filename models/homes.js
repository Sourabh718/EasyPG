const path = require('path');
const fs=require('fs');
const rootDir=require('../utils/pathUtils');
const { getDb } = require('../utils/database');
const { ObjectId } = require('mongodb');

module.exports = class Home{
    constructor(houseName, price, location, rating, photoUrl,_id){
        this.houseName=houseName;
        this.price=price;
        this.location=location;
        this.rating=rating;
        if(photoUrl){
        this.photoUrl=photoUrl;  
        }
        if(_id){
            this._id=_id;
            // this._id = new ObjectId(_id);
        }      
    }

    save(){
        const db= getDb();
        if(this._id){
            let updatedItem = {
                houseName:this.houseName,
                price:this.price,
                location:this.location,
                rating:this.rating,
                photoUrl:this.photoUrl
            }
            return db.collection('homes').updateOne({_id:new ObjectId(String(this._id))},{$set : updatedItem})
        }
        else
        return db.collection('homes').insertOne(this);
    }

    static fetchAll(){
        const db=getDb();
       return db.collection('homes').find().toArray();
    }
    static findById(homeId,callback){
        const db=getDb();
        return db.collection('homes').find({_id:new ObjectId(String(homeId))}).next(); 
        //jab mogodb me find function call karte hai to vo ek cursor return karta hai, not the actual document. next is use to call the cursor to get the next document
    }

    static deleteById(homeId,callback){
         const db=getDb();
        return db.collection('homes').deleteOne({_id:new ObjectId(String(homeId))})
    }
}