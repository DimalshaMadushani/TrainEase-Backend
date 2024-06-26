import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import CardDetail from "../models/cardDetail.model.js";

const dbUrl = "mongodb://127.0.0.1:27017/train-booking-test";

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const saltRounds = 10;


const users = [
    {
        username: "kalum123",
        firstName: "Kalum",
        lastName: "Wijesekara",
        email: "kalum@example.com",
        password: "password123",
        phone: "0712345678",
        gender: "male"
    },
    {
        username: "nimal456",
        firstName: "Nimal",
        lastName: "Perera",
        email: "nimal@example.com",
        password: "password456",
        phone: "0723456789",
        gender: "male"
    },
    {
        username: "amaya789",
        firstName: "Amaya",
        lastName: "Bandara",
        email: "amaya@example.com",
        password: "password789",
        phone: "0734567890",
        gender: "female"
    },
    {
        username: "sachini123",
        firstName: "Sachini",
        lastName: "Silva",
        email: "sachini@example.com",
        password: "password123",
        phone: "0745678901",
        gender: "female"
    },
    {
        username: "mahesh456",
        firstName: "Mahesh",
        lastName: "Gunawardena",
        email: "mahesh@example.com",
        password: "password456",
        phone: "0756789012",
        gender: "male"
    },
];

const cardDetails = [
    {
        cardNumber: "1234567812345678",
        expiryDate: "12/25",
        cvv: 123,
        cardHolderName: "Kalum Wijesekara"
    },
    {
        cardNumber: "2345678923456789",
        expiryDate: "11/24",
        cvv: 456,
        cardHolderName: "Nimal Perera"
    },
    {
        cardNumber: "3456789034567890",
        expiryDate: "10/23",
        cvv: 789,
        cardHolderName: "Amaya Bandara"
    }
];

async function populate() {
    try {
        await User.deleteMany({});
        await CardDetail.deleteMany({});

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            const newUser = new User({ ...user, password: hashedPassword });
            await newUser.save();
            console.log(`User ${user.username} saved successfully.`);
        }

        const savedUsers = await User.find({});

        const cardDetailsWithUserRef = cardDetails.map((cardDetail, index) => {
            return {
                ...cardDetail,
                userRef: savedUsers[index]._id
            };
        });

        for (const cardDetail of cardDetailsWithUserRef) {
            const newCardDetail = new CardDetail(cardDetail);
            await newCardDetail.save();
            console.log(`Card detail for ${cardDetail.cardHolderName} saved successfully.`);
        }

        console.log("Data populated successfully.");
    } catch (error) {
        console.error("Error populating data:", error);
    } finally {
        mongoose.connection.close();
    }
}

populate();
