import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: "filmixreal@gmail.com",
        pass: "njxwipkvcndbgtzc",
    },
});

async function sendMail(to, subject, text, html) {

    await transporter.sendMail({
        from: '"filmixreal@gmail.com" <no-reply@yourapp.com>',
        to,
        subject,
        text,
        html,
    })
}
;
export default sendMail