export const otpVerify = (username, otp) => {
    return (
        `
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="background: #007bff; color: #ffffff; text-align: center; padding: 20px;">
              <h1 style="margin: 0; font-size: 24px;">Verify Your Email</h1>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #007bff; font-size: 20px; margin-bottom: 10px;">Hi, ${username}!</h2>
              <p style="margin: 10px 0;">Thanks for signing up with <strong>Filmix</strong>. To complete your registration, please verify your email address by entering the OTP below:</p>
              <div style="text-align: center; margin: 20px 0;">
                <div style="display: inline-block; background: #f7f7f7; border: 1px dashed #007bff; padding: 15px 30px; border-radius: 8px; font-size: 24px; color: #333; font-weight: bold;">
                  ${otp}
                </div>
              </div>
              <p style="margin: 10px 0;">If you did not sign up for a Filmix account, please ignore this email or contact our support team.</p>
            </div>
            <div style="text-align: center; padding: 10px; font-size: 14px; color: #666; background: #f1f1f1;">
              <p style="margin: 5px;">© 2024 Filmix. All rights reserved.</p>
              <p style="margin: 5px;"><a href="http://filmix.com/privacy-policy" style="color: #007bff; text-decoration: none;">Privacy Policy</a> | <a href="http://filmix.com/terms" style="color: #007bff; text-decoration: none;">Terms & Conditions</a></p>
            </div>
          </div>
        </body>`
    );
};
