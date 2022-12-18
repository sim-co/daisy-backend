import dotenv from "dotenv";

dotenv.config();

const envList  = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "daisy",
    "host": "129.154.198.23",
    "port" : 49302,
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "database_test",
    "host": "129.154.198.23",
    "port" : 49302,
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": "root",
    "database": "database_production",
    "host": "129.154.198.23",
    "port" : 49302,
    "dialect": "postgres"
  }
}
export default  envList ;