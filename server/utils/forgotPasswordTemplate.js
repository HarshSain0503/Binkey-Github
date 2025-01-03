const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div>
       <p>Dear, ${name}</p>
       <p>You have requested a password reset. Please use this OTP to reset your password:</p>
       <div style="background: yellow; font-size: 20px; padding:20px; font-weight: 900; text-align: center">
           ${otp} <!-- The OTP number will appear here -->
       </div>
       <p>This OTP will expire in 15 minutes.</p>
       <br/>
       <p>Thanks,</p>
       <p>Binkey</p>
    </div>
   `;
}

export default forgotPasswordTemplate;
