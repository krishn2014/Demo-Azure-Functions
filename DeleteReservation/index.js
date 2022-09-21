const azure = require('azure-storage');

const reservationsvc = azure.createTableService("storagehackathonaccount",process.env.AZURE_STORAGE_ACCESS_KEY);

const deleteEntity = (tableName, entity) =>{
    return new Promise((resolve, reject) =>{
        reservationsvc.deleteEntity(
            tableName,
            entity,
            (error, result, response) => {
                if(error){
                    reject(error);
                }else{
                    resolve(response);
                }
            }
        );
    });
};
module.exports = async function (context, req) {
    try {
        const {username, RowKey}  = context.bindingData;
        const entity ={
            PartitionKey : { _ : username},
            RowKey : { _ : RowKey.toSring()}
        };
        await deleteEntity("Reservations", entity);
    } catch (error) {
        context.res ={
            status :500,
            body : error.message
        }
    }
}