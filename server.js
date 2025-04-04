require("dotenv").config();  // Load environment variables

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_CREDENTIALS, "utf8"));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();  // Firestore Database
const app = express();

app.use(cors());  // Allow requests from frontend
app.use(express.json());  // Parse JSON request body

// Route to Store Email in Firestore
app.post("/store-email", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        await db.collection("emails").add({ email, timestamp: new Date() });

        res.json({ message: "Email saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving email", error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
