const { subscribeToQueue } = require('./broker');

const { sendEmail } = require('../email')


module.exports = function () {
       
   subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async (data)=> {
    const emailHTMLTemplate =  `
    <h1>Welcome to FarmShop! 🌱</h1>

    <p>Hello ${data.name},</p>

    <p>Thank you for registering with us.</p>

    <p>We're glad to have you on board.</p>

    <p>– FarmShop Team</p>
    `;

    await sendEmail(data.email,"Welcome to Our Service", "Thank you for registering with us!", emailHTMLTemplate);
})

}

