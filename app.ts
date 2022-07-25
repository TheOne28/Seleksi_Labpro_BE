
import express from 'express'
require('dotenv').config();

import { ExpressInstance } from './services/express';

const port = process.env.PORT || 3001;
const app : express.Application = ExpressInstance.getInstance().getApp();

app.get('/', (req, res) =>{
    console.log("Hello world");
})

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
})