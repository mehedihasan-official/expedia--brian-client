import { useContext, useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";

const SignIn = () => {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/"; // Redirect to the previous page or default to homepage

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await googleLogin(); // Call googleLogin function from context
      Swal.fire({
        title: "Successfully Logged In with Google",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
      });
      navigate(from, { replace: true }); // Redirect to the previous page
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error logging in with Google",
        footer: "Please try again later",
      });
    }
  };

  // Handle manual login
  const handleManualLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter both email and password.",
      });
      return;
    }

    try {
      await login(email, password); // Call login function from context
      Swal.fire({
        title: "Successfully Logged In",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
      });
      navigate(from, { replace: true }); // Redirect to the previous page
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or password.",
        footer: "Please try again.",
      });
    }
  };

  // Handle Continue button click
  const handleContinue = () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your email.",
      });
      return;
    }
    setShowPassword(true); // Show password input field
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800 mb-2">
        Sign in or create an account
      </h1>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6">
        Unlock a world of rewards with one account across Platinum Club,
        Hotels.com, and Vrbo.
      </p>

      {/* Google Sign-In Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 mb-4 hover:bg-gray-50 transition-colors"
      >
        <FcGoogle className="text-xl" />
        <span className="text-gray-700 font-medium">Sign in with Google</span>
      </button>

      {/* Divider with "or" */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Email Input Field */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Password Input Field (Conditional) */}
      {showPassword && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {/* Continue/Login Button */}
      <button
        onClick={showPassword ? handleManualLogin : handleContinue}
        className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition-colors"
      >
        {showPassword ? "Login" : "Continue"}
      </button>

      {/* Other Ways to Sign In */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">Other ways to sign in</p>
        <div className="flex justify-center gap-4">
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            <FaApple className="text-xl text-gray-700" />
          </button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            <FaFacebook className="text-xl text-blue-600" />
          </button>
        </div>
      </div>

      {/* Terms and Conditions Paragraph */}
      <p className="mt-6 text-center text-xs text-gray-500">
        By continuing, you have read and agree to our{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Terms and Conditions
        </a>
        ,{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Privacy Statement
        </a>
        , and{" "}
        <a href="#" className="text-blue-600 hover:underline">
          One Key Rewards Terms & Conditions
        </a>
        .
      </p>
    </div>
  );
};

export default SignIn;
