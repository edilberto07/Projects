const Sequelize = require('sequelize');
const config = require('./config.json');
const dbConfig = config.Connection.dbConfig;
const db = {};

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.driver,
    pool: { 
        max: 5, 
        min: 0, 
        acquire: 60000,  // Increased from 30000
        idle: 10000 
    },
    timezone: dbConfig.timezone,
    dialectOptions: {
        multipleStatements: true,
        connectTimeout: 60000,  // Added connection timeout
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    retry: {
        max: 3,  // Maximum retry attempts
        match: [/Deadlock/i, /ETIMEDOUT/]  // Retry on these errors
    }
});

// Add connection error handling
sequelize.authenticate()
    .then(() => {
        console.log(`Connection established at ${dbConfig.host}`);
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.MultiQueryResult = (arr) => {
    var output = {};
    for (var root = 0; root < arr.length - 1; root++) {
        var mainList = Object.keys(arr[root]).map((item) => arr[root][item]);
        (mainList !== null) && (output[`result${root}`] = mainList);
    }
    return output;
}
db.emailRequest = async (email) => {
    const nodemailer = require('nodemailer');
    try {
        const response = await nodemailer.createTransport({
            host: config.emailer.host,
            port: 587,
            auth: {
                user: config.emailer.user,
                pass: config.emailer.pass
            }
        }).sendMail({ from: config.emailer.user, to: email.to, subject: email.subject, text: email.text, html: email.html });
        return response;
    } catch (err) {
        return { error: true, message: `Error : ${err}` }
    }
}
db.emailRequestWithAttachment = async (email) => {
    try {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            host: config.emailer.host,
            port: 587,
            auth: {
                user: config.emailer.user,
                pass: config.emailer.pass
            }
        });
        await transporter.sendMail({
            from: config.emailer.user,
            to: email.to,
            subject: email.subject,
            text: email.text,
            html: email.html,
            attachments: [
                {
                    filename: email.filename,
                    href: email.fileurl
                }
            ]
        }).then((res) => {
            console.log('Done sending email from config.');
            return { error: false, data: res };
        }).catch((err) => {
            console.log(`Error sending email from config. Error: ${err}`);
            return { error: true, message: err };
        });
    } catch (err) {
        return { error: true, message: `Error : ${err}` }
    }
}

module.exports = db;