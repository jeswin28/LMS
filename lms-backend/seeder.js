const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const { sequelize } = require('./config/db');
const User = require('./models/User');

const adminData = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
    status: 'active',
};

const importData = async () => {
    try {
        await sequelize.sync();
        const existing = await User.findOne({ where: { email: adminData.email } });
        if (existing) {
            console.log('Admin user already exists.');
            process.exit();
        }
        await User.create(adminData);
        console.log('Admin user created!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await sequelize.sync();
        await User.destroy({ where: { email: adminData.email, role: 'admin' } });
        console.log('Admin user destroyed!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
} 