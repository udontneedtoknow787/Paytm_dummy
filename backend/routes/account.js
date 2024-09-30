const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const {authMiddleware} = require('../middleware')
const {Account} = require('../db')

router.get('/balance', authMiddleware, async function(req, res){
    const account = await Account.findOne({
        userId: req.userId
    });
    res.json({
        balance: account.balance
    })
});

router.post('/transfer', authMiddleware, async function(req, res){
    const session = await mongoose.startSession();

    (await session).startTransaction();
    console.log("session started");
    const {amount , to} = req.body;
    const account = await Account.findOne({
        userId: req.userId
    }).session(session);
    if(!account || account.balance<amount){
        (await session).abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance OR account not found"
        })
    }
    const toAccount = await Account.findOne({
        userId: to
    }).session(session);
    if(!toAccount){
        (await session).abortTransaction();
        return res.status(400).json({
            message: "Invalid account OR reciever account does not exist"
        })
    }
    // perform the tranfer
    await Account.updateOne({
        userId: req.userId
    },{
        $inc: {balance: -amount}
    }).session(session);
    await Account.updateOne({
        userId: to
    },{
        $inc: {balance: +amount}
    }).session(session);
    (await session).commitTransaction();        // transfer complete
    console.log("session ended");
    return res.status(200).json({
        message: "Transfer Succesfull"
    })
});

module.exports = router;