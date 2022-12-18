import Sequelize  from "sequelize";
import User from "./User";
import configs from "../config/config.js"

const env = process.env.NODE_ENV || "development";
const config = configs[env];
const db = {sequelize: undefined};

export const sequelize = new Sequelize( //config의 db정보와 연결
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;

User.init(sequelize);  

User.associate(db); 
