require('dotenv').config();

const Sequelize = require('sequelize');

// Sequelize uses login details to access the database, as provided by environment variables (from .ENV)
const sequelize = new Sequelize(process.env.DB_NAME, 
      	          process.env.DB_USER, 
                  process.env.DB_PASSWORD, 
                  {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
      dialectOptions: {
        decimalNumbers: true,
      },
    });

module.exports = sequelize;
