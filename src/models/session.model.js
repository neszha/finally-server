import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
    code: {
        type: String, required: true, index: true, unique: true,
    },
    name: {
        type: String, required: true,
    },
    description: {
        type: String, required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('sessions', schema);

export default Model;
