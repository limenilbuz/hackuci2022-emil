const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


app.use(
  cors(),
);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/sendsms', (req, res) => {
    const {phonenumber, textmessage} = req.body;
    res.send(`text message is: ${textmessage}, phone number is: ${phonenumber}`)
    
    client.messages.create({
        body: 'Your machine is ready!',
        from: '+18455721554',
        to: '+19096315183'
    })
    .then(message => console.log(message.sid));
})
