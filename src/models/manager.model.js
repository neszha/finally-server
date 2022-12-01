import mongoose, { Schema } from 'mongoose';

const actifitySchama = new Schema({
    _id: {
        type: Schema.Types.ObjectId, index: true, auto: true,
    },
    loginAs: {
        type: String, required: true,
    },
    ip: {
        type: String, required: true,
    },
    os: {
        type: String,
    },
    browser: {
        type: String,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});

const schema = new Schema({
    name: {
        type: String, required: true,
    },
    username: {
        type: String, required: true, index: true, unique: true,
    },
    password: {
        type: String, required: true,
    },
    rule: {
        type: String,
        required: true,
        index: true,
        enum: ['administrator', 'supervisor'],
        default: 'administrator',
    },
    activities: [{ type: actifitySchama }],
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('managers', schema);

export default Model;
