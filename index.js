import { sendEmail } from './sendEmail.js'

sendEmail().then(info => {
    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', info)
}).catch(err => {
    console.log('Send Error: ', err)
})
