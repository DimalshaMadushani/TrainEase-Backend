import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
    coachNumber: {
        type: Number,
        required: true,
    },
    coachTypeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoachType',
        required: true,
    },
    seats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seat',
        },
    ],
});


const Coach = mongoose.model('Coach', coachSchema);
export default Coach;