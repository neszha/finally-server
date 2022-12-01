import mongoose, { Schema } from 'mongoose';

/** Main schema. */
const schema = new Schema({
    username: {
        type: String, required: true, index: true, unique: true,
    },
    password: {
        type: String, required: true,
    },
    participantId: {
        type: String, required: true,
    },
    name: {
        type: String, required: true,
    },
    sessionId: {
        type: Schema.Types.ObjectId, required: true, index: true, ref: 'sessions',
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('participants', schema);

export default Model;
