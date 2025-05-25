import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, whatsapp, email, kayakQuantity, paddleQuantity, selectedDuration, bookingDate, bookingTime, totalPrice } = req.body;

  // Get Grist API details from environment variables (server-side)
  const GRIST_DOC_ID = process.env.GRIST_DOC_ID; 
  const GRIST_API_KEY = process.env.GRIST_API_KEY;
  const GRIST_TABLE_ID = process.env.GRIST_TABLE_ID;

  // Basic validation for Grist details
  if (!GRIST_DOC_ID || !GRIST_API_KEY || !GRIST_TABLE_ID) {
    console.error('Grist API details are not configured on the server.');
    return res.status(500).json({ error: 'Server configuration error: Grist API details missing.' });
  }

   const bookingData = {
      Name: name,
      Whatsapp: whatsapp,
      Email: email || '', // Optional field
      Kayak_Quantity: kayakQuantity,
      Paddle_Quantity: paddleQuantity,
      Duration: selectedDuration === 'full' ? 'Full Day' : `${selectedDuration} hours`,
      Booking_Date: bookingDate || '',
      Booking_Time: bookingTime || '',
      Total_Price: Math.round(parseFloat(totalPrice)), // Ensure this is a number if Grist expects a number
      Status: 'Pending',
      Created_At: new Date().toISOString()
  };

  try {
      const gristResponse = await fetch(`https://docs.getgrist.com/api/docs/${GRIST_DOC_ID}/tables/${GRIST_TABLE_ID}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GRIST_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [
            {
              fields: bookingData
            }
          ]
        })
      });

      if (!gristResponse.ok) {
         const errorBody = await gristResponse.text();
         console.error('Grist API Error Response:', gristResponse.status, errorBody);
         return res.status(gristResponse.status).json({ error: `Grist API error: ${gristResponse.statusText}` });
      }

      const result = await gristResponse.json();
      console.log('Booking saved successfully in Grist:', result);

      // You might add WhatsApp sending logic here on the server side as well

      return res.status(200).json({ message: 'Booking request sent successfully!' });

    } catch (error) {
      console.error('Error submitting booking to Grist:', error);
      return res.status(500).json({ error: 'Error submitting booking.' });
    }
}
