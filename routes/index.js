const { Users } = require('../db/users.js')
const router = require("express").Router()
const bcrypt = require('bcrypt')


router.get('/', (req, res) => {


    if (!req.session.user) {
        console.log('No session')
        return res.redirect('/login')
    }

    const data = req.session.user

    console.log('session data')
    console.log(data)

    return res.render('index', { data })
})

router.get('/signup', (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }

    return res.render('signup')
})

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }

    return res.render('login')
})


router.get('/logout', (req, res) => {

    if (req.session.user) {
        console.log('logout - session data')
        console.log(req.session.user)
        req.session.user = null
    }

    return res.redirect('/login')
})


router.post('/signup', (req, res) => {

    if (req.session.user) {
        return res.redirect('/')
    }

    let { firstname, lastname, email, password } = req.body

    Users.read(email)
        .then(result => {
            console.log('signup - checking if user exits already')
            console.log(result)

            if (result.rowCount > 0)
                return res.status(403).json({
                    'status': false,
                    'message': 'Unknow user, please register'
                })

            bcrypt.hash(password, 12, (hashErr, hash) => {

                if (hashErr) {
                    console.log(hashErr)

                    return res.status(500).json({
                        'status': false,
                        'message': 'Error occured while signing up'
                    })
                }

                Users.create([firstname, lastname, email, hash])
                    .then(() => res.status(201).json({
                        'status': true,
                        'message': 'Account created sucessfully'
                    }))
                    .catch(createUserErr => {
                        console.log(createUserErr)
                        return res.status(500).json({
                            'status': false,
                            'message': 'Account creation unsucessfully'
                        })

                    })
            })

        })
        .catch(resultError => {

            console.log(resultError)
            return res.status(500).json({
                'status': false,
                'message': 'Please login'
            })

        })
})


router.post('/login', (req, res) => {

    if (req.session.user) {
        return res.redirect('/')
    }

    let { email, password } = req.body

    Users.read(email)
        .then(result => {

            if (result.rowCount > 0) {

                const hash = result.rows[0].password

                bcrypt.compare(password, hash, (compareErr, match) => {
                    if (compareErr) {

                        console.log(compareErr)

                        return res.status(403).json({
                            'status': false,
                            'message': 'Incorrect email or password'
                        })
                    }

                    if (match) {

                        req.session.user = {
                            firstname: result.rows[0].firstname,
                            lastname: result.rows[0].lastname,
                            email: result.rows[0].email,
                        }

                        return res.status(200).json({
                            'status': true,
                            'message': 'Login sucessful',
                            // 'user': req.session.user
                        })
                    }

                    return res.status(403).json({
                        'status': false,
                        'message': 'Login unsucessful'
                    })

                })

            } else {
                return res.status(403).json({
                    'status': false,
                    'message': 'Unknow user, please register'
                })
            }

        })
        .catch(readingPasswordErr => {

            console.log(readingPasswordErr)

            return res.status(500).json({
                'status': false,
                'message': 'Reading password error'
            })

        })
})




module.exports = { router }
