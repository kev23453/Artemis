const nodemailer = require("nodemailer");
const config = require("../Config/config");

class EmailService {
    constructor({ host, port, user, password, from, logger="" }) {
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: false, 
            auth: {user, pass: password}
        });
        this.from = from;
        this.logger = logger;
    }

    async sendMail(to, subject, html) {
        try {
            await this.transporter.sendMail({from: this.from, to, subject, html});
            console.log(`Correo enviado a ${to}: ${subject}`);
            return true;
        }
        catch(err) {
            // info: agregar el logger
            console.error(err);
            return false;
        }
    }


    sendExample(to) {
        const subject = "artemisame esta";
        const html = `
            <div><span>8188991</span></div>
        `;

        return this.sendMail(to, subject, html);
    }
}

module.exports = EmailService;