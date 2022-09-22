const { MongoClient } = require("mongodb")
const { v4:uuidv4 } = require("uuid")

const url = process.env.MONGODB_STORAGE_ACCESS_KEY;
const client = new MongoClient(url)



let reservations = [
    {
        _id : uuidv4(),
        username: "user1",
        date: "20-9-2022",
        hour: "2",
        numberOfPeople:"3"
    },
        {
            _id : uuidv4(),
            username: "user3",
            date: "21-9-2022",
            hour: "4",
            numberOfPeople:"10"
    },
        {
            _id : uuidv4(),
            username: "user3",
            date: "22-9-2022",
            hour: "4",
            numberOfPeople:"9"
    },
        {
            _id : uuidv4(),
            username: "user4",
            date: "22-9-2022",
            hour: "3",
            numberOfPeople:"8"
    },
    
    
]


module.exports = async function (context, req) {

    await client.connect();
    const database = client.db("Reservations")
    const collection = database.collection("Reservations")
    await collection.deleteMany({})
    await collection.insertMany(reservations);
    
        context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Initialising  is done"
    };
}
