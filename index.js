require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const database = require('./database');
const apiRouter = require('./routes');
const ErrorHandler = require('./middlewares/ErrorHandler');


const PORT = process.env.PORT;


const app = express();
app.use(cors()); 
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRouter);

app.use(ErrorHandler);


async function start() {
    try {

        await database(process.env.MONGODB_URL);
        
        app.listen(PORT, _ => console.log(`Server started on port ${PORT}`));
    
    } catch (error) {
        console.log(error);
    }
}

start();