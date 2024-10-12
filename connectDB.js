

const Sequelize = require("sequelize");
//changeme
const sequelize = new Sequelize('todo_db', 'postgres', 'postgres', {
    host: "localhost",
    dialect: "postgres",
    logging: false,
})



sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
});
const connect = async () => {
  return sequelize.authenticate();
}
  
module.exports = {
  connect,
  sequelize
}
  