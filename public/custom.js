// code from netninja
$(document).ready(function() {

    if (location.href == '/' && $.session.get('user')) {
        let { firstname, lastname, email } = $.session.get('user')

        $('#profile-firstname').text(firstname)
        $('#profile-lastname').text(lastname)
        $('#profile-email').text(email)
    }


    function err_body(error) {
        console.log(error.responseJSON.message)
        $("#err").css('display', 'block')
        $("#err").text(error.responseJSON.message)
    }


    $('#signup-form').on('submit', function(event) {
        event.preventDefault()

        const firstname = $('#sfirstname').val()
        const lastname = $('#slastname').val()
        const email = $('#semail').val()
        const password = $('#spassword').val()

        const data = { firstname, lastname, email, password }

        $.ajax({
            type: 'POST',
            url: '/signup',
            data: data,
            success: function() {
                $('form input').val('')
                location.href = '/login'
            },
            error: error => err_body(error)
        })

        return false;
    })


    $('#login-form').on('submit', function(event) {
        event.preventDefault()

        const email = $('#lemail').val()
        const password = $('#lpassword').val()

        const data = { email, password }

        console.log(data)

        $.ajax({
            type: 'POST',
            url: '/login',
            data: data,
            success: function() {
                $('form input').val('')
                location.href = '/'
            },
            error: error => err_body(error)
        })

        return false;
    })



})
