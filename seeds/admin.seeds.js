import Admin from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
const saltRounds = 10;
//seed data for admin
const adminData = [
  {
    username: "admin1",
    email: "admin1@gmail.com",
    password: "admin1",
    position: "level1 admin",
    },
    {
    username: "admin2",
    email: "admin2@gmail.com",
    password: "admin2",
    position: "level2 admin",
    },
];

const seedAdmin = async () => {
  try {
    await Admin.deleteMany();
    for (const admin of adminData) {
      const hashedPassword = await bcryptjs.hash(admin.password, saltRounds);
      const newAdmin = new Admin({ ...admin, password: hashedPassword });
      await newAdmin.save();
      console.log(`Admin ${admin.username} saved successfully.`);
    }
    console.log("Admin data seed successfully");
  } catch (error) {
    console.error("Error seeding admin data", error);
  }
};

export default seedAdmin;