import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
    key: {
        type: String, required: true, index: true, unique: true,
    },
    data: {
        type: Schema.Types.Mixed, required: true, default: {},
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('settings', schema);

export default Model;
