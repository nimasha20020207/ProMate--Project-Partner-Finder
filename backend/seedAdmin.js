require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("./models/Student");

const connectDB = require("./config/db");

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL || "admin@promate.com";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";

        let adminUser = await Student.findOne({ email: adminEmail });
        if (!adminUser) {
            console.log("Admin user not found, inserting...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPass, salt);

            adminUser = new Student({
                fullName: "Administrator",
                studentId: "IT00000000",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                department: "Administration"
            });

            await adminUser.save();
            console.log("Admin seeded successfully.");
        } else {
            // Ensure they have the admin role
            if (adminUser.role !== "admin") {
                adminUser.role = "admin";
                await adminUser.save();
                console.log("Updated existing user to admin role.");
            } else {
                console.log("Admin user already exists.");
            }
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
