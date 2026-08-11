const { Resend }= require('resend')


const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (address, message, subject) => {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'sammyphala99@gmail.com',
        subject: subject,
        html: message,
    })
}


module.exports = sendEmail