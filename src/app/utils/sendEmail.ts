import nodemailer from "nodemailer";

export const sendEmail = async (emailReceiver: string, reset_url: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "habib.ielts.gc@gmail.com",
            pass: "vrqa iefi acvs aqiq",
        },
    });


    // send mail with defined transport object
    await transporter.sendMail({
        from: '"Friday football 👻" <habib.ielts.gc@gmail.com>', // sender address
        to: emailReceiver, // list of receivers
        subject: "Reset your password ✔", // Subject line
        text: "", // plain text body
        html: `<!DOCTYPE html>
<html>
<head>
    <style>
        .reset-button {
            background-color: #001f3f; /* Navy blue */
            color: white; /* White text */
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .email-container {
            font-family: Arial, sans-serif;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            max-width: 600px;
            margin: auto;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Hello,</h2>
        <p>We received a request to reset your password for your Friday Football account. Click the button below to reset your password:</p>
        <a href=${reset_url} class="reset-button">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thanks,<br>The Friday Football Team</p>
    </div>
</body>
</html>`, // html body
    });

    console.log("Message sent: %s");
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

};


