module.exports = (client, error) => {
    new client.methods.log(client).error(error);
}
