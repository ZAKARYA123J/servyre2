const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer=require('nodemailer')

const app = express();
const connection = require('./connecte');
const port = 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.listen(port, async () => {
    await connection(app);
    console.log("Server started...");
});

app.get('/', async (req, res) => {
    try {
        const collection = app.locals.client.db('project').collection('users');
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/hello',(req,res)=>{
    res.send('hello word')
})
// ... (your existing imports)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const collection = app.locals.client.db('project').collection('users'); // Define the collection here

    try {
        const user = await collection.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                res.json('Success');
            } else {
                res.json('Incorrect password');
            }
        } else {
            res.json('No email');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});
app.post('/sign', async (req, res) => {
    const { name, email,password } = req.body;
    const item = { name, email,password };
    if (await checkEmail(item.email)) {
        res.status(200).json({ message: "Already exists" });
    } else {
        try {
            const collection = app.locals.client.db('project').collection('users');
            const itemNew = await collection.insertOne(item);
      
            res.status(200).json({ msg: "success" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
});
app.post('/Reservation', async (req, res) => {
    const { email, name, number, reference, message,data1  } = req.body;
    const item = { email, name, number, reference, message,data1  };

    try {
        const collection = app.locals.client.db('project').collection('resirvation');
        const result = await collection.insertOne(item);
        console.log(result.ops);
        await sendwithemail(name, email,reference,message,number,data1 ); // Logs the inserted document

        res.status(200).json({ msg: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

async function sendwithemail(name, email,reference,message,number,data1 ) {
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ppetbu@gmail.com',
            pass: 'mpyt trip tyop osdq'
        }
    });

    const mailoption = {
        from: 'ppetbu@gmail.com',
        to: 'ppetbu@gmail.com', // Update this with the actual recipient's email address
        subject: 'new user',
        text: `new user are registered \n name:${name} \nemail :${email} \n Reference: ${data1} \n number: ${number} \n message: ${message} `
    };

    try {
        await transport.sendMail(mailoption);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send email");
    }
}

// ... (rest of your code)



async function checkEmail(email) {
    const collection = app.locals.client.db('project').collection('data');
    const existingUser = await collection.findOne({ email: email });
    return existingUser !== null;
}
