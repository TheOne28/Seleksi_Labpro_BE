
import express from 'express'
import { ExpressInstance } from './services/express';


require('dotenv').config();


const port = process.env.PORT || 3001;
const app : express.Application = ExpressInstance.getInstance().getApp();

app.get('/', (req, res) =>{
    console.log("Hello world");
})

const profileRouter = require('./route/profileRoute');
const mutasiRouter = require('./route/mutasiRoute');
const historyRouter = require('./route/historyRoute');
const autentikasiRouter = require('./route/authentikasiRoute');

app.use('/profile', profileRouter);
app.use('/mutasi', mutasiRouter);
app.use('/history', historyRouter);
app.use('/authen', autentikasiRouter);

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
})
