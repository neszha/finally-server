import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
    name: {
        type: String, required: true,
    },
    picture: {
        type: String, default: null,
    },
    gender: {
        type: String,
        required: true,
        enum: ['man', 'woman', 'anonym'],
        default: 'anonym',
    },
    description: {
        type: String,
    },
    username: {
        type: String, required: true, index: true, unique: true,
    },
    password: {
        type: String, required: true,
    },
    locations: {
        x: {
            type: Number, default: 0,
        },
        y: {
            type: Number, default: 0,
        },
    },
    isOnline: {
        type: Boolean, required: true, default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('users', schema);

export default Model;
