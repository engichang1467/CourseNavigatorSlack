require('dotenv').config()

const SlackBot = require('slackbots')
const axios = require('axios')
const search = require('./search')

const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: "course_navigator"
})


// Start Handler
bot.on('start', () => {
    console.log("Course Navigator is ready!!!")

    bot.postMessageToChannel(
        'general',
        "Hi there, I'm the Course Navigator!!!\nI'll help you find the information that you need for any course at SFU"
    );
})


// Error Handler
bot.on('error', (err) => {
    console.log(err)
})


// Message Handler
bot.on('message', (data) => {
    if (data.type !== 'message')
        return
    
        handleMessage(data.text)
})


const handleMessage = (message) => {
    
    const [CMD_NAME, ...args] = message.split(/\s+/)
    if(args[0] === 'find') 
    {
    
        // console.log(CMD_NAME === 'find')
        // console.log(args)

        console.log(args[1])
        console.log(args[2])

        bot.postMessageToChannel('general', search.findClass(args[1], args[2]))
    } 
    else if(args[0] === 'help') 
    {
        bot.postMessageToChannel('general', "You can search up any courses here by typing the following command\n```find cmpt 165```")
    }

}

const hello = () => {
    bot.postMessageToChannel('general', 'Hello there')
}

