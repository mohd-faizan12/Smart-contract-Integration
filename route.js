const express=require('express');
const route=express.Router();
const controller=require('./controller')

route.post('/new-greet',controller.PostGreet);
route.get('/old-greet',controller.getOldGreet);

module.exports = route;

