// Placeholder for Twilio integration
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSms(to, body) {
  // return client.messages.create({
  //   body: body,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: to
  // });
  return Promise.resolve({ sid: 'mock_sid' });
}

async function sendVoiceCall(to, message) {
  // return client.calls.create({
  //   twiml: `<Response><Say>${message}</Say></Response>`,
  //   to: to,
  //   from: process.env.TWILIO_PHONE_NUMBER
  // });
  return Promise.resolve({ sid: 'mock_call_sid' });
}

module.exports = {
  sendSms,
  sendVoiceCall
};
