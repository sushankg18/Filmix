export const feedbackMail = (name) => {
    return `
      <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <div style="background: #007bff; color: #ffffff; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Your Feedback!</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #007bff; font-size: 20px; margin-bottom: 10px;">Hi, ${name}!</h2>
            <p style="margin: 10px 0;">We truly appreciate you taking the time to share your valuable feedback with us. Your thoughts help us grow and deliver an even better experience at <strong>Filmix</strong>.</p>
            <p style="margin: 10px 0;">We’re committed to ensuring your satisfaction, and your input plays a critical role in helping us achieve that. Please don't hesitate to reach out if you have any more suggestions or need assistance in the future.</p>
            <div style="text-align: center; margin: 20px 0;">
              <p style="font-size: 16px; color: #333; margin: 0;">Wishing you a great day ahead!</p>
              <p style="font-size: 16px; color: #007bff; margin: 5px 0;"><strong>Team Filmix</strong></p>
            </div>
          </div>
          <div style="text-align: center; padding: 10px; font-size: 14px; color: #666; background: #f1f1f1;">
            <p style="margin: 5px;">© 2024 Filmix. All rights reserved.</p>
            <p style="margin: 5px;"><a href="http://filmix.com/support" style="color: #007bff; text-decoration: none;">Contact Support</a> | <a href="http://filmix.com/faq" style="color: #007bff; text-decoration: none;">FAQs</a></p>
          </div>
        </div>
      </body>
    `;
  };
  