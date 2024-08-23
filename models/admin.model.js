import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
        enum: ["level1 admin", "level2 admin"],
    },
    });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;