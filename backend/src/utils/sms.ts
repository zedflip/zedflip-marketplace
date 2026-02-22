// SMS utility for Zambia - using placeholder for SMS provider
// Popular options: Africa's Talking, Twilio, Zamtel API

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendSMS = async (
  phone: string,
  message: string
): Promise<SMSResponse> => {
  try {
    // Validate Zambian phone number
    if (!phone.match(/^\+260[0-9]{9}$/)) {
      throw new Error('Invalid Zambian phone number');
    }

    // TODO: Integrate with actual SMS provider
    // Example with Africa's Talking:
    // const africastalking = require('africastalking')({
    //   apiKey: process.env.SMS_API_KEY,
    //   username: process.env.SMS_USERNAME,
    // });
    // const sms = africastalking.SMS;
    // const result = await sms.send({
    //   to: [phone],
    //   message: message,
    //   from: process.env.SMS_SENDER_ID,
    // });

    console.log(`SMS sent to ${phone}: ${message}`);
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    };
  }
};

export const sendOTP = async (phone: string): Promise<{ success: boolean; otp?: string }> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const message = `Your ZedFlip verification code is: ${otp}. Valid for 10 minutes.`;
  
  const result = await sendSMS(phone, message);
  
  if (result.success) {
    return { success: true, otp };
  }
  
  return { success: false };
};

export const sendListingNotification = async (
  phone: string,
  listingTitle: string,
  action: 'sold' | 'inquiry' | 'favorite'
): Promise<SMSResponse> => {
  const messages = {
    sold: `Congratulations! Your listing "${listingTitle}" has been marked as sold on ZedFlip.`,
    inquiry: `Someone is interested in your listing "${listingTitle}" on ZedFlip. Check your messages!`,
    favorite: `Your listing "${listingTitle}" was added to favorites on ZedFlip!`,
  };
  
  return sendSMS(phone, messages[action]);
};

export default { sendSMS, sendOTP, sendListingNotification };
