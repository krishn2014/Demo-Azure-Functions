const {mongoclient, MongoClient} = require("mongodb") 
const {v4:uuidv4} = require("uuid")
const url = process.env.MONGODB_STORAGE_ACCESS_KEY
const client = new MongoClient(url)

module.exports = async function (context, req) {
    await client.connect();
    const database = client.db("Reservations");
    const collection = database.collection("Reservations")
    let reservation = await collection.findOne({_id : req.params.id});
    if(!reservation){
        return context.res ={
            status :400,
            body: "no user found"
        }
    }
    return (conetxt.res)={
        body: reservation
    }
}