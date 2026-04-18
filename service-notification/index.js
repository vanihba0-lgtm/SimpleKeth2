require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const twilio = require('./twilio');
// const firebase = require('./firebase');

// Dummy data pull cron (simulates fetching Agmarknet/Weather API)
// In production, use 'node-cron' or BullMQ
setInterval(() => {
  console.log('[Cron] Fetching latest Mandi & Weather data from APIs...');
  // Logic to pull from Agmarknet & OpenWeather and update Django Core DB
}, 1000 * 60 * 30); // Run every 30 mins

const languageTemplates = {
  en: { sell: "SELL NOW - Profit ₹", hold: "HOLD - Wait for better price" },
  hi: { sell: "अभी बेचें - लाभ ₹", hold: "रुकें - बेहतर कीमत का इंतजार करें" },
  te: { sell: "ఇప్పుడే అమ్మండి - లాభం ₹", hold: "ఆగండి - మంచి ధర కోసం వేచి ఉండండి" },
  ta: { sell: "இப்போதே விற்கவும் - லாபம் ₹", hold: "காத்திருங்கள் - நல்ல விலைக்கு" },
  kn: { sell: "ಈಗಲೇ ಮಾರಿ - ಲಾಭ ₹", hold: "ಕಾಯಿರಿ - ಉತ್ತಮ ಬೆಲೆಗೆ" },
  mr: { sell: "आत्ता विका - नफा ₹", hold: "थांबा - चांगल्या किंमतीची वाट पाहा" },
  bn: { sell: "এখনই বিক্রি করুন - লাভ ₹", hold: "অপেক্ষা করুন - ভালো দামের জন্য" },
  gu: { sell: "હમણાં વેચો - નફો ₹", hold: "રાહ જુઓ - સારા ભાવ માટે" },
  pa: { sell: "ਹੁਣੇ ਵੇਚੋ - ਮੁਨਾਫਾ ₹", hold: "ਉਡੀਕ ਕਰੋ - ਬਿਹਤਰ ਕੀਮਤ ਲਈ" },
  or: { sell: "ବର୍ତ୍ତମାନ ବିକ୍ରି କରନ୍ତୁ - ଲାଭ ₹", hold: "ଅପେକ୍ଷା କରନ୍ତୁ - ଭଲ ଦର ପାଇଁ" }
};

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

app.post('/api/notify', async (req, res) => {
  const { userId, phone, message, type, channels, lang = 'en', profit = '' } = req.body;
  
  if (!channels || !Array.isArray(channels)) {
    return res.status(400).json({ error: 'channels array is required' });
  }

  // Construct localized message if standard type
  let finalMessage = message;
  if (type === 'recommendation' && languageTemplates[lang]) {
    finalMessage = message.includes('SELL') 
      ? `${languageTemplates[lang].sell}${profit}` 
      : languageTemplates[lang].hold;
  }

  const results = {};

  try {
    // Mocking notification for MVP
    if (channels.includes('sms')) {
      // await twilio.sendSms(phone, finalMessage);
      console.log(`[SMS][${lang}] Sent to ${phone}: ${finalMessage}`);
      results.sms = 'success';
    }

    if (channels.includes('voice')) {
      // await sendVoiceCall(phone, message);
      console.log(`[Voice][Mock] Called ${phone}: ${message}`);
      results.voice = 'success';
    }

    if (channels.includes('push')) {
      // await sendPushNotification(userId, message);
      console.log(`[Push][Mock] Sent to User ${userId}: ${message}`);
      results.push = 'success';
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Notification service listening at http://localhost:${port}`);
});
