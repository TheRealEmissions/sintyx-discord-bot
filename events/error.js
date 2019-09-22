module.exports = (client, error) => {
    let startDate = new Date().getTime();
    new client.methods.log(client).error(error);
    new client.methods.log(client).debugStats(`error`, client.user, new Date().getTime() - startDate);
}
