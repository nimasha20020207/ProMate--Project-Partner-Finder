require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("./models/Student");

const connectDB = require("./config/db");

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL || "adminpromate@gmail.com";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";

        let adminUser = await Student.findOne({ email: adminEmail });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPass, salt);

        if (!adminUser) {
            console.log("Admin user not found, inserting...");
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
            console.log("Admin user found, updating details...");
            adminUser.fullName = "Administrator";
            adminUser.password = hashedPassword;
            adminUser.role = "admin";
            adminUser.department = "Administration";
            
            await adminUser.save();
            console.log("Admin updated successfully.");
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
