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
        const query = `INSERT INTO app_users(firstname, lastname, email, password) VALUES($1, $2, $3, $4)`
        return client.query(query, params)
    },
    read: email => {
        const query = `SELECT id, firstname, lastname, email, password FROM app_users WHERE email = $1`
        return client.query(query, [email])
    },
    update: params => {
        const query = `UPDATE app_users set firstname = $2, lastname = $ WHERE email = $1`
        return client.query(query, params)
    },
    delete: email => {
        const query = `DELETE FROM app_users WHERE email = $1`
        return client.query(query, [email])
    },

}

module.exports = { Users }
