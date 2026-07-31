const { Resend }= require('resend')


const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (address, link) => {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['sammyphala99@gmail.com'],
        subject: 'Hello World',
        html: `Follow the link to active your account <a>${link}</a>`,
    })
}


module.exports = sendEmail