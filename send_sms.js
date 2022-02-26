const accountSid = 'AC4cf8bba49fa5f4053b9785dd4f8bb4e8';
const authToken = '393a48423a38fc8d4ea1aec5d6bff0ec';
const client = require('twilio')(accountSid, authToken);

function sendMessage() {
    client.messages.create({
        body: 'Your machine is ready!',
        from: '+18597150986',
        to: '+12404724142'
   })
  .then(message => console.log(message.sid));
}
