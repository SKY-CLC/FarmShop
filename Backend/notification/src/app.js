const express = require('express');
const { connect } = require('./broker/broker');
const setListeners = require('../src/broker/listners')


const app = express();



connect().then(()=>{
   setListeners();
})



module.exports = app;