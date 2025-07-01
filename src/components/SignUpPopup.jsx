
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaRocket, FaStar, FaGraduationCap } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useSignUp } from '../contexts/SignUpContext';

const SignUpPopup = () => {
  const { isPopupVisible, hideSignUpPopup, showSignUpPopup, } = useSignUp();
  const [isLogin, setIsLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      showSignUpPopup();
    }, 900000);

    const initialTimeout = setTimeout(() => {
      showSignUpPopup();
    }, 900000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [showSignUpPopup]);

  const handleClose = () => {
    hideSignUpPopup();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLogin(false);
    setShowOtpPopup(false);
    setOtp('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://new-lms-backend-vmgr.onrender.com/api/v1/auth/register',
        {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
          role: registerData.role,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setShowOtpPopup(true);
      setSuccessMessage('Registration successful! Please verify OTP sent to your email.');
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e)=>{
     e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage('Please enter a valid 6-digit OTP.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://lms-backend-flwq.onrender.com/api/v1/auth/verify-email',
        {
          email: registerData.email,
          otp: otp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccessMessage('Thank you for signing up! Welcome to our learning platform!');
      setShowOtpPopup(false);
      setOtp('');
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'student',
      });
      // await fetchUserProfile();
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginData.email || !loginData.password) {
      setErrorMessage('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://new-lms-backend-vmgr.onrender.com/api/v1/auth/login',
        {
          email: loginData.email,
          password: loginData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { success, message, data } = response.data;
      if (!success) {
        throw new Error(message || 'Login failed');
      }

      localStorage.setItem('Token', data.token);
      setSuccessMessage('Login successful! Welcome back!');
      setLoginData({ email: '', password: '' });
      // await fetchUserProfile(); // Fetch profile after login
      setTimeout(() => {
        handleClose();
      }, 2000);

      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPopupVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <FaTimes className="text-gray-600 text-sm sm:text-base" />
        </button>

        {showOtpPopup ? (
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Enter OTP</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              An OTP has been sent to {registerData.email}. Please enter it below.
            </p>
            {errorMessage && <p className="text-red-500 mb-4 text-center text-sm sm:text-base">{errorMessage}</p>}
            {successMessage && (
              <div className="text-center">
                <p className="text-green-500 mb-4 text-sm sm:text-base">{successMessage}</p>
                <button
                  onClick={() => {
                    setSuccessMessage('');
                    setIsLogin(true);
                    setShowOtpPopup(false);
                  }}
                  className="bg-teal-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-teal-600 text-sm sm:text-base"
                >
                  Back to Login
                </button>
              </div>
            )}
            {!successMessage && (
              <form onSubmit={handleOtpSubmit} className="w-full max-w-xs sm:max-w-sm space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-teal-500 benne rounded-md text-sm sm:text-base"
                    required
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 sm:py-3 sm:px-6 bg-teal-500 text-white rounded-md hover:bg-teal-600 text-sm sm:text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-50 to-blue-50 p-6 lg:p-8 flex-col justify-center items-center relative">
              <div className="absolute top-4 lg:top-6 left-4 lg:left-6 bg-white rounded-full px-2 lg:px-3 py-1 shadow-sm">
                <div className="flex items-center text-xs lg:text-sm">
                  <FaRocket className="text-purple-500 mr-1" />
                  <span className="text-gray-700 font-medium">Career Switch</span>
                </div>
              </div>
              <div className="absolute top-16 lg:top-20 right-4 lg:right-6 bg-white rounded-full px-2 lg:px-3 py-1 shadow-sm">
                <div className="flex items-center text-xs lg:text-sm">
                  <FaGraduationCap className="text-blue-500 mr-1" />
                  <span className="text-gray-700 font-medium">Promotion</span>
                </div>
              </div>
              <div className="absolute bottom-16 lg:bottom-20 left-4 lg:left-6 bg-white rounded-full px-2 lg:px-3 py-1 shadow-sm">
                <div className="flex items-center text-xs lg:text-sm">
                  <FaStar className="text-green-500 mr-1" />
                  <span className="text-gray-700 font-medium">Salary Hike</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-48 h-64 bg-gradient-to-b from-red-400 to-red-500 rounded-t-full relative overflow-hidden">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-white rounded-t-3xl shadow-lg">
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full relative">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-200 rounded-full">
                          <div className="absolute top-3 left-2 w-1 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-3 right-2 w-1 h-1 bg-black rounded-full"></div>
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b-2 border-black rounded-full"></div>
                        </div>
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-black rounded-t-full"></div>
                      </div>
                    </div>
                    <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-200 rounded-full border-2 border-gray-300"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="absolute bottom-0 left-4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-600"></div>
                  <div className="absolute bottom-0 right-4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-600"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 rounded-full opacity-80"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-t from-yellow-300 to-orange-400 rounded-full"></div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
              <h2 className="text-xl text-center sm:text-2xl font-semibold mb-2 text-center">Welcome to LMS!</h2>

              {errorMessage && <p className="text-red-500 mb-4 text-center text-sm sm:text-base">{errorMessage}</p>}
              {successMessage && (
                <div className="text-center">
                  <p className="text-green-500 mb-4 text-sm sm:text-base">{successMessage}</p>
                  {/* <button
                    onClick={() => {
                      setSuccessMessage('');
                      setIsLogin(true);
                    }}
                    className="bg-teal-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-teal-600 text-sm sm:text-base"
                  >
                    Back to Login
                  </button> */}
                </div>
              )}

              <div className="flex mb-4 sm:mb-6 justify-center">
                <button
                  className={`px-4 py-2 sm:px-6 sm:py-2 text-white rounded-l-md ${isLogin ? 'bg-teal-500' : 'bg-teal-300'} text-sm sm:text-base`}
                  onClick={() => setIsLogin(true)}
                >
                  LOGIN
                </button>
                <button
                  className={`px-4 py-2 sm:px-6 sm:py-2 text-white rounded-r-md ${!isLogin ? 'bg-teal-500' : 'bg-teal-300'} text-sm sm:text-base`}
                  onClick={() => setIsLogin(false)}
                >
                  REGISTER
                </button>
              </div>

              <div className="w-full max-w-xs sm:max-w-sm">
                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="w-full p-2 sm:p-3 border border-teal-500 rounded-md text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="mb-3 sm:mb-4 relative">
                      <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Password</label>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full p-2 sm:p-3 border border-teal-500 rounded-md pr-8 sm:pr-10 text-sm sm:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2 sm:right-3 top-9 sm:top-11 text-gray-600 hover:text-gray-800"
                      >
                        {showLoginPassword ? (
                          <AiOutlineEyeInvisible className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between items-center mb-4 sm:mb-5">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`py-2 px-4 sm:py-3 sm:px-6 bg-teal-500 text-white rounded-md hover:bg-teal-600 text-sm sm:text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setErrorMessage('Forgot Password functionality not implemented.')}
                        className="text-teal-600 hover:underline text-sm sm:text-base"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={registerData.firstName}
                          onChange={handleRegisterChange}
                          className="w-full p-2 sm:p-3 border border-teal-500 rounded-md text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={registerData.lastName}
                          onChange={handleRegisterChange}
                          className="w-full p-2 sm:p-3 border border-teal-500 rounded-md text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="w-full p-2 sm:p-3 border border-teal-500 rounded-md text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Phone Number</label>
                      <div className="flex">
                        <div className="flex items-center bg-gray-50 border border-teal-500 rounded-l-md px-3">
                          <img
                            src="https://flagcdn.com/w20/in.png"
                            alt="India"
                            className="w-5 h-3 mr-2"
                          />
                          <span className="text-gray-700 font-medium">+91</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          className="flex-1 p-2 sm:p-3 border border-l-0 border-teal-500 rounded-r-md text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Password</label>
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="w-full p-2 sm:p-3 border border-teal-500 rounded-md pr-8 sm:pr-10 text-sm sm:text-base"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-2 sm:right-3 top-9 sm:top-11 text-gray-600 hover:text-gray-800"
                      >
                        {showRegisterPassword ? (
                          <AiOutlineEyeInvisible className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Confirm Password</label>
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="w-full p-2 sm:p-3 border border-teal-500 rounded-md pr-8 sm:pr-10 text-sm sm:text-base"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-2 sm:right-3 top-9 sm:top-11 text-gray-600 hover:text-gray-800"
                      >
                        {showRegisterPassword ? (
                          <AiOutlineEyeInvisible className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2 px-4 sm:py-3 sm:px-6 bg-teal-500 text-white

 rounded-md hover:bg-teal-600 text-sm sm:text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? 'Registering...' : 'Create Account'}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPopup;
