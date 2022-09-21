//initialize
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
    const entity = {
        PartitionKey : {'_':username},
        RowKey : {'_':new Date().getTime().toString()},
        date : {'_' : date},
        hour : {'_': hour},
        numberOfPeople : {'_': numberOfPeople}

    }
    const result = await insertEntity("Reservations", entity);
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