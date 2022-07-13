require('dotenv').config()

// Express

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post('/api/createNewUser', async (req, res) => {
    let query = req.body;

    console.log(req)

    let phone = query.phone;
    let email = query.email;
    let name = query.name;

    res.sendStatus(await initCreateNewUser(name, email, phone));
})

app.listen(process.env.EXPRESS_PORT,(_, __) => {
    console.log(`API started on port: ${process.env.EXPRESS_PORT}`);
});

// Express end

async function initCreateNewUser(name, email, phone) {
    if (!name && !email && !phone) return 400
   try {
       console.log("test")
       if (await sendUserInfo(name, email, phone))
           return 201
   } catch (e) {
       return e
   }
}


// Mongo

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createUser(name, email, phone) {
    console.log(name, email, phone)
    console.log(prisma.users)
    let result = await prisma.users.create({
        data: {
            name: name,
            phone: phone,
            email: email
        }
    })
    console.log(result)
    if (!result) return false;
    return !!result;
}

// Mongo end


// Nodemailer

const nodemailer = require('nodemailer');

async function sendUserInfo(name, email, phone) {
    if (!email) return false;

    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_SMTP,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: `${email}`,
            subject: 'Новая заявка',
            text: ` Имя - ${name} \n Телефон - ${phone} \n Емэйл - ${email}`,
        });

        return true;
    } catch (e) {
        console.log(e);
    }
}

//Nodemailer end