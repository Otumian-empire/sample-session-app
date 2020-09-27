require('dotenv').config()

const { Client } = require('pg')

const client = new Client()


client.connect()
    .then(() => {
        console.log(`DB connected`)
    })
    .catch(err => console.log(`Connection error ${err.stack}`))


const Users = {
    create: params => {
        const query = `INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4)`
        return client.query(query, params)
    },
    read: email => {
        const query = `SELECT FROM users WHERE email = $1`
        return client.query(query, [email])
    },
    update: params => {
        const query = `UPDATE users set firstname = $2, lastname = $ WHERE email = $1`
        return client.query(query, params)
    },
    delete: email => {
        const query = `DELETE FROM users WHERE email = $1`
        return client.query(query, [email])
    },

}

module.exports = { Users }
