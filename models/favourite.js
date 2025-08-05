const path = require('path');
const fs=require('fs');
const rootDir=require('../utils/pathUtils');
const { getDb } = require('../utils/database');

module.exports = class Favourite{
    constructor(id){
        this.id=id;
    }
    save(){
        const db=getDb();
        return db.collection('favourites').insertOne(this);
    }
    static getFavourite(){
        const db=getDb();
        return db.collection('favourites').find().toArray();
    }

    static removeFavourites(deleteId){
        const db=getDb();
        return db.collection('favourites').deleteMany({id:deleteId})
    }
}
    // static addToFavourite(homeId,callback){
    //    Favourite.getFavourite(favouriteItem=>{
    //         if(favouriteItem.includes(homeId)){
    //             callback("This home is already marked as favourite")
    //         }
    //         else{
    //             favouriteItem.push(homeId);
    //             fs.writeFile(favouritesDataPath, JSON.stringify(favouriteItem),callback);
    //         }
    //     });
    // }
