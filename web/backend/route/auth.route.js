import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Account from "../model/account.model.js";
import UserProfile from "../model/userProfile.model.js";
import { sendOtpEmail } from "../services/email.service.js";

const router = Router();

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const cleanEmail = email.toLowerCase().trim();

        const existingAccount = await Account.findOne({ email: cleanEmail });
        if (existingAccount && existingAccount.status === "active") {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        let account = existingAccount;
        if (!account) {
            account = new Account({
                email: cleanEmail,
                password: hashedPassword,
                status: "unverified",
                otp: {
                    code: otpCode,
                    expires_at: expiresAt,
                    purpose: "register",
                },
            });
            await account.save();

            const profile = new UserProfile({
                account_id: account._id,
                full_name: name?.trim() || "New User",
            });
            await profile.save();
        } else {
            account.password = hashedPassword;
            account.otp = {
                code: otpCode,
                expires_at: expiresAt,
                purpose: "register",
            };
            await account.save();

            if (name) {
                await UserProfile.findOneAndUpdate(
                    { account_id: account._id },
                    { full_name: name.trim() }
                );
            }
        }

        await sendOtpEmail(account.email, otpCode, "register");

        res.status(200).json({
            success: true,
            requireOtp: true,
            email: account.email,
            message: "Verification code sent to your email",
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const cleanEmail = email.toLowerCase().trim();
        const account = await Account.findOne({ email: cleanEmail });

        if (!account) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const otpCode = generateOtp();
        account.otp = {
            code: otpCode,
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
            purpose: "login",
        };
        await account.save();

        await sendOtpEmail(account.email, otpCode, "login");

        res.status(200).json({
            success: true,
            requireOtp: true,
            email: account.email,
            message: "Security code sent to your email",
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP code are required" });
        }

        const cleanEmail = email.toLowerCase().trim();
        const account = await Account.findOne({ email: cleanEmail });

        if (!account || !account.otp || !account.otp.code) {
            return res.status(400).json({ success: false, message: "No pending verification code found" });
        }

        if (new Date() > new Date(account.otp.expires_at)) {
            return res.status(400).json({ success: false, message: "OTP code has expired. Please request a new one." });
        }

        if (account.otp.code !== otp.trim()) {
            return res.status(400).json({ success: false, message: "Invalid OTP code" });
        }

        account.status = "active";
        account.last_login_at = new Date();
        account.otp = { code: null, expires_at: null, purpose: null };
        await account.save();

        const profile = await UserProfile.findOne({ account_id: account._id });


        const token = jwt.sign(
            {
                account_id: account._id,
                email: account.email,
                role: account.role,
            },
            process.env.JWT_ACCESS_SECRET || "default_jwt_secret",
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "7d" }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: account._id,
                email: account.email,
                role: account.role,
                full_name: profile?.full_name || "User",
                avatar: profile?.avatar || "",
                default_language: profile?.default_language || "vi",
                default_writing_style: profile?.default_writing_style || "Chuyên nghiệp",
            },
            message: "Verification successful",
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;
        const cleanEmail = (email || "").toLowerCase().trim();

        const account = await Account.findOne({ email: cleanEmail });
        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        const otpCode = generateOtp();
        const purpose = account.status === "unverified" ? "register" : "login";

        account.otp = {
            code: otpCode,
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
            purpose,
        };
        await account.save();

        await sendOtpEmail(account.email, otpCode, purpose);

        res.status(200).json({ success: true, message: "New verification code sent" });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;