const button = document.querySelector(".btn");

button.addEventListener("click", async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;

    const otp = generateOTP(); 

    try {
        await sendOTP(email, otp); 
        alert("OTP sent to your email. Please check your inbox!");
        
        window.location.href = '/verify-otp'; 
    } catch (error) {
        console.error(error);
        alert("Failed to send OTP. Please try again later.");
    }
});

function generateOTP() {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

async function sendOTPEmail(email, otp) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'One-Time Password (OTP)',
      text: `Your One-Time Password (OTP) for password reset is: ${otp}`
    };
  
    await transporter.sendMail(mailOptions);
  }
  