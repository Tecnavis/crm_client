import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import './style.css'; 
import { signInCustomer, URL } from '../components/handle_api';
import { useForm } from '../components/useForm';
import axios from 'axios';
import Swal from 'sweetalert2';
function SignIn() {
  const [values,handleChange]=useForm({
    email:'',
    password:''
  })

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOTPsent, setIsOTPsent] = useState(false);
  const [isOTPverified, setIsOTPverified] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${URL}/customer/forgot-password`, { email });
      if (response.status === 200) {
        setIsOTPsent(true);
        Swal.fire({
          icon: 'success',
          title: 'OTP sent successfully',
          text: 'Check your email for the OTP',
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send OTP',
      })
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${URL}/customer/verify-otp`, { email, otp });
      if (response.status === 200) {
        setIsOTPverified(true);
        Swal.fire({
          icon: 'success',
          title: 'OTP verified successfully',
        })
      }
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to verify OTP',
      })
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post(`${URL}/customer/reset-password`, { email, newPassword });
      Swal.fire({
        icon: 'success',
        title: 'Password reset successfully',
      })
      window.location.href="/";
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reset password',
      })
    }
  };
  return (
    <MDBContainer fluid className="d-flex justify-content-center align-items-center custom-container">
      <MDBCard className='mx-3 mb-5 p-4 shadow-5 custom-card'>
        <MDBCardBody className='p-4 text-center'>
          <h2 className="fw-bold mb-5">{isForgotPassword ? "Reset Password" : "Sign in"}</h2>

          {!isForgotPassword ? (
            <>
              <MDBInput 
                wrapperClass='mb-4' 
                placeholder='Email' 
                id='signin-email' 
                type='email' 
                name='email'
                onChange={handleChange}
                value={values.email}
                required='required'
              />
              <MDBInput 
                wrapperClass='mb-4' 
                placeholder='Password' 
                id='signin-password' 
                type='password' 
                name='password'
                onChange={handleChange}
                value={values.password}
                required='required' 
              />
              <button className='btn-1' onClick={() => signInCustomer(values)} >Sign In</button>

              <div className="d-flex justify-content-between mb-4">
                <a href="#!" className="small" onClick={() => setIsForgotPassword(true)}>Forgot Password?</a>
                <a href="/register" className="small">Don't have an account? Sign up</a>
              </div>
            </>
          ) : (
            <>
              <MDBInput wrapperClass='mb-4' placeholder='Enter your email' id='forgot-email' type='email' onChange={(e) => setEmail(e.target.value)} disabled={isOTPsent} />
              <button className='btn-1' size='md' onClick={handleForgotPassword} disabled={isOTPsent}>Send OTP</button>

              {isOTPsent && (
                <>
                  <MDBInput wrapperClass='mb-4' placeholder='Enter OTP' id='otp' type='text' onChange={(e) => setOtp(e.target.value)} disabled={isOTPverified} />
                  <button className='btn-1' size='md' onClick={handleVerifyOTP} disabled={isOTPverified}>Verify OTP</button>
                </>
              )}

              {isOTPverified && (
                <>
                  <MDBInput wrapperClass='mb-4' placeholder='Enter new password' id='new-password' type='password' onChange={(e) => setNewPassword(e.target.value)} />
                  <button className='btn-1' size='md' onClick={handleResetPassword}>Reset Password</button>
                </>
              )}
            </>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default SignIn;
