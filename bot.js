require('dotenv').config()

const SlackBot = requrie('slackbots')
const axios = requrie('axios')

const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: "course_navigator"
})

