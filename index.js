require('dotenv').config()
const express = require('express')
const session = require('express-session')
const { router } = require('./routes/index.js')

const app = express()
const port = process.env.port || 3000

app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret:'secret-key',
    resave: false,
    saveUninitialized: false,
}))

app.use('', router)

app.listen(port, () => {
    console.log(`Server running on port ${port} at ${new Date()}`)
    console.log(`Open localhost:${port}/ in the browser`)
})
