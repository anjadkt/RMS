// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// module.exports = client ;


const axios = require('axios');
require('dotenv').config();

const sendSMS = async ( phone, message ) => {
    try {

      const BASE_URL = 'https://api.textbee.dev/api/v1'
      const API_KEY = process.env.TEXTBEE_API_KEY ;
      const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID ;

      const response = await axios.post(
        `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
        {
          recipients: [ phone ],
          message
        },
        { headers: { 'x-api-key': API_KEY } }
      )
      console.log("SMS sent successfully ✅");
      return response.data;
      
    } catch (error) {
      console.log("SMS failed ❌", error.response?.data || error.message);
    }
};

module.exports = sendSMS ;
