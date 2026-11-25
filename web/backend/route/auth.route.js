import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Account from "../model/account.model.js";
import UserProfile from "../model/userProfile.model.js";

const router = Router();

/**
 * POST /api/auth/register
 * Direct email + password registration without OTP
 */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const cleanEmail = email.toLowerCase().trim();

        const existingAccount = await Account.findOne({ email: cleanEmail });
        if (existingAccount) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const account = new Account({
            email: cleanEmail,
            password: hashedPassword,
            status: "active",
            last_login_at: new Date(),
        });
        await account.save();

        const profile = new UserProfile({
            account_id: account._id,
            full_name: name?.trim() || "New User",
        });
        await profile.save();

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
                full_name: profile.full_name,
                avatar: profile.avatar || "",
                default_language: profile.default_language || "vi",
                default_writing_style: profile.default_writing_style || "Chuyên nghiệp",
            },
            message: "Registration successful",
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/auth/login
 * Direct email + password login without OTP
 */
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

        account.last_login_at = new Date();
        account.status = "active";
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
            message: "Login successful",
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
