//initialize
const azure = require('azure-storage');

const reservationsvc = azure.createTableService("kragrawalhack22a441",process.env.AZURE_STORAGE_ACCESS_KEY);
const queryEntities = (tableName, query) =>{
    return new Promise((resolve, reject) =>{
        reservationsvc.queryEntities(
            tableName,
            query,
            null,
            {payloadFormat:"application/json;odata=nometadata"},
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
        const username = context.bindingData.username;

        var query = new azure.TableQuery().where("PartitionKey eq ?", username);

        const result = await queryEntities("Reservations", query);

        context.res = {
            body: result
        };
    }catch (error){
        context.res ={
            status: 500,
            body: error.message
        };
    };
   
    };
    