const { Users } = require('../db/users.js')
const router = require("express").Router()
const bcrypt = require('bcrypt')


router.get('/', (req, res) => {
    return res.render('index')
})

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.get('/login', (req, res) => {
    return res.render('login')
})


router.post('/logout', (req, res) => {
    return res.render('index')
})

router.post('/signup', (req, res) => {

    let { firstname, lastname, email, password } = req.body

    bcrypt.hash(password, 12, (hashErr, hash) => {

        if (hashErr) {
            console.log(hashErr)
            return res.status(500).json({
                'status': false,
                'message': 'Error occured while signing up'
            })
        }

        db.createUser([firstname, lastname, email, hash])
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


router.post('/login', (req, res) => {

    let { email, password } = req.body

    db.readOnePasswordUser(email)
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

                    if (match)
                        return res.status(200).json({
                            'status': true,
                            'message': 'Login sucessful'
                        })

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


router.post('/forgetpassword', (req, res) => {

    const { email } = req.body

    db.readOneUser(email)
        .then(fpRes => {

            if (fpRes.rowCount < 1)
                return res.status(403)
                    .json({ 'status': false, 'message': 'Incorect credentials' })

            const code = getCode()

            db.createCode([email, code])
                .then(() => {

                    console.log(`RestCode: ${code}`)

                    sendEmail(email, code)
                        .then(() => res.status(200).json({
                            'status': true,
                            'message': 'We have sent you an email to reset your password'
                        }))
                        .catch(sendEmailErr => {

                            console.log(sendEmailErr)
                            return res.status(500).json({
                                'status': false,
                                'message': 'Reset error'
                            })

                        })

                })
                .catch(createCodeErr => {

                    console.log(createCodeErr)
                    return res.status(200).json({
                        'status': true,
                        'message': 'Please check your email, code has been sent already'
                    })

                })

        })
        .catch(fpErr => {
            console.log(fpErr)
            return res.status(500).json({ 'status': false, 'message': 'Reset error' })
        })

})


router.post('/resetpassword', (req, res) => {

    let { email, password, code } = req.body

    db.readCode(email)
        .then(readCodeRes => {

            if (readCodeRes.rowCount < 1)
                return res.status(403).json({
                    'status': false,
                    'message': 'Please register or login'
                })

            if (readCodeRes.rows[0].code !== code)
                return res.status(403).json({ 'status': false, 'message': 'Please check and enter the code again' })

            db.updateUser.password([email, password])
                .then(() => {
                    db.deleteCode(email)
                        .then(() => res.status(200).json({ 'status': true, 'message': 'Reset successful' }))
                        .catch(deleteCodeErr => {
                            console.log(`deleteCodeErr: ${deleteCodeErr}`)
                            return res.status(500).json({ 'status': false, 'message': 'Reset error' })
                        })

                })
                .catch(updateUserErr => {
                    console.log(`updateUserErr: ${updateUserErr}`)
                    return res.status(500).json({ 'status': false, 'message': 'Reset error' })
                })

        })
        .catch(readCodeErr => {
            console.log(`readCodeErr: ${readCodeErr}`)
            return res.status(500).json({ 'status': false, 'message': 'Reset error' })
        })
})




module.exports = { router }
