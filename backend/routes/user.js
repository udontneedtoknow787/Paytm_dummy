const express = require("express");
const router = express.Router();
const zod = require('zod')
const jwt = require('jsonwebtoken')
const {User, Account} = require('../db')
const {JWT_SECRET} = require('./config')
const {authMiddleware} = require('../middleware')

const signupSchema = zod.object({
    username: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
});
const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string()
});

router.post('/signup', async function(req, res){
    const body = req.body;
    const {success} = signupSchema.safeParse(body);             // use curly brace cz its return an object, so use result.succes without curly braces
    if(!success){
        return res.json({
            message: "Invalid inputs. PLease inter valid data."
        })
    }
    const user = await User.findOne({
        username: body.username
    })
    if(user){
        return res.status(403).json({
            message: "Username already taken. Please try again with diffrent username."
        })
    }
    const dbUser = await User.create({
        username: body.username,
        firstname: body.firstname,
        lastname: body.lastname,
        password: body.password
    });
    
    await Account.create({
        userId: dbUser._id,
        balance: ((1+Math.random())*1000)
    })
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET);
    
    return res.json({
        message: "User created Succesfully.",
        token: token
    })
})

router.post('/signin', async function(req, res){
    const body = req.body;
    const {success} = signinSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Error while loging in"
        })
    }
    const user = await User.findOne({
        username: body.username,
        password: body.password
    });
    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        return res.status(200).json({
            token: token
        })
    }
    else{
        return res.status(411).json({
            message: "Error while logging in"
        })
    }
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    const user = await User.findOne({_id: req.userId});
    // console.log(user);
    await User.updateOne(
        {_id: req.userId},
        {
            $set: req.body
        }
    )
    // console.log(updateuser)

    res.json({
        message: "Updated successfully"
    })
})

router.post('/dashboard',authMiddleware, async function(req,res){
    const userID = req.userId;
    const user = await User.findOne({
        _id: userID
    });
    // console.log(user);
    const account = await Account.findOne({
        userId: userID
    });
    // console.log(account);
    if(!user || !account){
        return res.status(404).json({
            message: "Error finding the accounts"
        })
    }
    return res.status(200).json({
        userId: user._id,
        balance: account.balance
    });
})

module.exports = router;