import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";

// Clean Lucide/Feather inline SVGs for Eye and EyeOff
const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

export default function Auth() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("signin");
    const [step, setStep] = useState("credentials");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [resendCountdown, setResendCountdown] = useState(60);

    useEffect(() => {
        let timer;
        if (step === "otp" && resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step, resendCountdown]);

    useEffect(() => {
        if (step === "otp" && otpRefs.current[0]) {
            otpRefs.current[0].focus();
        }
    }, [step]);

    const handleSubmitCredentials = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        if (mode === "signup") {
            if (!name.trim()) {
                setErrorMessage("Please enter your full name.");
                return;
            }
            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }
            if (password.length < 6) {
                setErrorMessage("Password must be at least 6 characters.");
                return;
            }
        }

        try {
            setLoading(true);
            const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
            const payload = mode === "signup" ? { name, email, password } : { email, password };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to process request");
            }

            if (data.requireOtp) {
                setStep("otp");
                setResendCountdown(60);
            }
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5 && otpRefs.current[index + 1]) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            setOtp(digits);
            if (otpRefs.current[5]) otpRefs.current[5].focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e?.preventDefault();
        setErrorMessage("");

        const fullCode = otp.join("");
        if (fullCode.length !== 6) {
            setErrorMessage("Please enter the complete 6-digit verification code.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: fullCode,
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Invalid verification code");
            }

            localStorage.setItem("bg_auth_token", data.token);
            localStorage.setItem("bg_user", JSON.stringify(data.user));

            navigate("/studio");
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCountdown > 0) return;
        setErrorMessage("");
        try {
            setLoading(true);
            const response = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to resend code");
            }
            setResendCountdown(60);
            setOtp(["", "", "", "", "", ""]);
            if (otpRefs.current[0]) otpRefs.current[0].focus();
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shadcn-auth-container">
            <div className="auth-card">
                {/* Brand Header */}
                <div className="auth-card-header">
                    <div className="brand-badge">✨ Blog Genius</div>
                    <h1>{step === "otp" ? "Check your email" : mode === "signin" ? "Welcome back" : "Create an account"}</h1>
                    <p>
                        {step === "otp"
                            ? `We sent a 6-digit security code to ${email}`
                            : mode === "signin"
                                ? "Enter your credentials to access your workspace"
                                : "Start creating AI-powered SEO & GEO blog content"}
                    </p>
                </div>

                {/* Error Alert */}
                {errorMessage && <div className="error-alert">⚠️ {errorMessage}</div>}

                {/* STEP 1: CREDENTIALS FORM */}
                {step === "credentials" && (
                    <>
                        {/* Segmented Switcher */}
                        <div className="auth-tabs">
                            <button
                                type="button"
                                className={`tab-btn ${mode === "signin" ? "active" : ""}`}
                                onClick={() => {
                                    setMode("signin");
                                    setErrorMessage("");
                                    setConfirmPassword("");
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${mode === "signup" ? "active" : ""}`}
                                onClick={() => {
                                    setMode("signup");
                                    setErrorMessage("");
                                    setConfirmPassword("");
                                }}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmitCredentials}>
                            {mode === "signup" && (
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Alex Morgan"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn-toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            {mode === "signup" && (
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn-toggle-password"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            title={showConfirmPassword ? "Hide password" : "Show password"}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? "Processing..." : mode === "signin" ? "Continue to verification" : "Create account"}
                            </button>
                        </form>
                    </>
                )}

                {/* STEP 2: 6-DIGIT OTP VERIFICATION (shadcn InputOTP) */}
                {step === "otp" && (
                    <div>
                        <button
                            type="button"
                            className="btn-back-link"
                            onClick={() => {
                                setStep("credentials");
                                setOtp(["", "", "", "", "", ""]);
                                setErrorMessage("");
                            }}
                        >
                            ← Use different email
                        </button>

                        <form onSubmit={handleVerifyOtp}>
                            {/* 6 Separated OTP Digit Inputs */}
                            <div className="otp-wrapper" onPaste={handleOtpPaste}>
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (otpRefs.current[idx] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="otp-box"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading || otp.join("").length !== 6}
                            >
                                {loading ? "Verifying..." : "Verify & Sign In"}
                            </button>
                        </form>

                        {/* Resend Countdown */}
                        <div className="otp-resend-area">
                            Didn&apos;t receive the code?{" "}
                            {resendCountdown > 0 ? (
                                <span>Resend in {resendCountdown}s</span>
                            ) : (
                                <button type="button" onClick={handleResendOtp} disabled={loading}>
                                    Resend code
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
