import mongoose from "mongoose";

const cardDetailSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    cvv: {
        type: Number,
        required: true,
    },
    cardHolderName: {
        type: String,
        required: true,
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
});

const CardDetail = mongoose.model("CardDetail", cardDetailSchema);

export default CardDetail;