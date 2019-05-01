/**
 * Created by Administrator on 2017/8/18 0018.
 */
let MongoClient=require('mongodb').MongoClient;

let DbUrl='mongodb://localhost:27017';  /*连接数据库*/
let DbName = 'tank';


function  __connectDb(callback){


    MongoClient.connect(DbUrl,function(err,client){

        if(err){

            console.log('数据库连接失败');
            return;
        }
        //增加 修改 删除

        callback(client);


    })

}

//数据库查找
/*
 Db.find('user',{},function(err,data){
    data数据
})

 */
exports.find=function(collectionname,json,callback){

    __connectDb(function(client){


        const db = client.db(DbName);
        let result=db.collection(collectionname).find(json);

        result.toArray(function(error,data){

            callback(error,data);/*拿到数据执行回调函数*/
            client.close();/*关闭数据库连接*/
        })

    })

}

//增加数据
exports.insert=function(collectionname,json,callback){

    __connectDb(function(client){

        const db = client.db(DbName);
        db.collection(collectionname).insertOne(json,function(error,data){

            callback(error,data);
            client.close();/*关闭数据库连接*/
        })
    })

}


//增加数据
exports.update=function(collectionname,json1,json2,callback){

    __connectDb(function(client){
        const db = client.db(DbName);
        db.collection(collectionname).updateOne(json1,{$set:json2},function(error,data){

            callback(error,data);
            client.close();/*关闭数据库连接*/
        })
    })

}

//删除数据
exports.deleteOne=function(collectionname,json,callback){

    __connectDb(function(client){
        const db = client.db(DbName);
        db.collection(collectionname).deleteOne(json,function(error,data){
            callback(error,data);
            client.close();/*关闭数据库连接*/
        })
    })

}