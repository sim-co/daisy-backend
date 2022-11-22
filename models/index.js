import Sequelize from "sequelize";
import clients from "./Client";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize( //config의 db정보와 연결
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.Client= clients;

clients.init(sequelize);  

clients.associate(db); 

module.exports = db;