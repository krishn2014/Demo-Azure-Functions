const { MongoClient } = require("mongodb")
const { v4:uuidv4 } = require("uuid")

const url = process.env.MONGODB_STORAGE_ACCESS_KEY;
const client = new MongoClient(url)


module.exports = async function (context, req) {
    try{
    if(!req.body){
        context.res = {
            status:400,
            body: "Pass a request body"
        };
        return;
    }
    const {username, date, hour, numberOfPeople } = req.body;
    if(!username || !date ||!hour ||!numberOfPeople ){
        context.res = {
            status: 400,
            body : "One or more required fields missing"
        };
        return;
    }
    let reservation ={
        _id : uuidv4(),
        username: username,
        date: date,
        hour: hour,
        numberOfPeople: numberOfPeople
}

    await client.connect();
    const database = client.db("Reservations")
    const collection = database.collection("Reservations")
    await collection.insert(reservation);
    
        context.res = {
        // status: 200, /* Defaults to 200 */
        body: reservation
    };
}
catch(error){
    context.res ={
    status:500,
    body : error.toString()

}
}
}