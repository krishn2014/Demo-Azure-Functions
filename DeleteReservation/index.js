const azure = require('azure-storage');

const reservationsvc = azure.createTableService("kragrawalhack22a441",process.env.AZURE_STORAGE_ACCESS_KEY);

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
        const username  = context.bindingData.username;
        let rowKey = context.bindingData.rowKey;
        rowKey= rowKey.toString();
        const entity ={
            PartitionKey : { _ : username},
            RowKey : { _ : rowKey}
        };
        await deleteEntity("Reservations", entity);
    } catch (error) {
        context.res ={
            status :505,
            body : error.message
        }
    }
}