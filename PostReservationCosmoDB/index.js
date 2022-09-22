const azure = require('azure-storage');

const reservationsvc = azure.createTableService("storagehackathonaccount",process.env.AZURE_STORAGE_ACCESS_KEY);
const insertEntity = (tableName, entity) =>{
    return new Promise((resolve, reject) =>{
        reservationsvc.insertEntity(
            tableName,
            entity,
            {echoContent: true, payloadFormat:"application/json;odata=nometadata"},
            (error, result, response) => {
                if(error){
                    reject(error);
                }else{
                    resolve(response.body);
                }
            }
        );
    });
};

var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://azure-cosmodbapiformongodb:bnT9XVW1QE0ca62u53GhOFfempUW2zBJRVy7sUgaB4qJ3jBHPgugIzPGkakyzys1tQZP6msdiw621A66A8nnEA%3D%3D@azure-cosmodbapiformongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@azure-cosmodbapiformongodb@", function (err, client) {
  client.close();
});

const db = client.db(`ReservationApp`);
console.log(`New/existing database:\t${db.databaseName}\n`);

const collection = db.collection('reservations');
console.log(`New collection:\t${collection.collectionName}\n`);

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a POST request.');
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
    const entity = {
        PartitionKey : {'_':username},
        RowKey : {'_':new Date().getTime().toString()},
        date : {'_' : date},
        hour : {'_': hour},
        numberOfPeople : {'_': numberOfPeople}

    }

    // for cosmodb via mongoapi
    const query = { name: entity.username};
    const update = { $set: entity };
    const options = {upsert: true, new: true};
    
    // Insert via upsert (create or replace) doc to collection directly
    const result = await collection.updateOne(query, update, options);
    console.log(`Reservations: ${JSON.stringify(result)}\n`);
    // end

    result = await insertEntity("Reservations", entity);
    context.res ={
        body: result
    };

    }catch(error){
        console.log(error);
        context.res = {
            status : 500, 
            body: error.toString()
        
        }
    }
}

