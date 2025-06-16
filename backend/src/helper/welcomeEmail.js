export const welcomeEmail = (username) => {
    return (
        ` <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div style="background: #4caf50; color: #ffffff; text-align: center; padding: 20px;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to Filmix!</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #4caf50; font-size: 20px; margin-bottom: 10px;">Hi, ${username}!</h2>
                    <p style="margin: 10px 0;">We’re excited to have you on board. Thank you for registering with <strong>Filmix</strong>. Here are a few things you can do:</p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Explore amazing features.</li>
                        <li>Connect with others.</li>
                        <li>Manage your profile and preferences.</li>
                    </ul>
                    <p style="margin: 10px 0;">If you have any questions, feel free to reply to this email. We’re here to help you!</p>
                </div>
              
            </div>
        </body>
    </html >`

    )

}