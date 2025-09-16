// lms-backend/config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/config.env' });

let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
} else if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      logging: false
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected: Database connection established successfully.');

    // Sync all models with database (in development or test)
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      console.log('Database synchronized.');
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };