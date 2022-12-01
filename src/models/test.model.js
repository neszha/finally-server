import mongoose, { Schema } from 'mongoose';

const sectionSchame = new Schema({
    _id: {
        type: Schema.Types.ObjectId, auto: true,
    },
    order: {
        type: Number, required: true, default: 0,
    },
    name: {
        type: String, required: true, default: 'Untitled Section!',
    },
    description: {
        type: String, required: true, default: 'No description!',
    },
    allocation: {
        type: Number, required: true, min: 0, default: 0,
    },
    isListening: {
        type: Boolean, required: true, default: false,
    },
    scores: [{
        type: Number, default: null,
    }],
}, {
    timestamps: true,
});

const partSchame = new Schema({
    _id: {
        type: Schema.Types.ObjectId, auto: true,
    },
    order: {
        type: Number, required: true, default: 0,
    },
    name: {
        type: String, required: true, default: 'Untitled Group!',
    },
    description: {
        type: String, required: true, default: 'No description!',
    },
    sectionId: {
        type: Schema.Types.ObjectId, required: true,
    },
}, {
    timestamps: true,
});

const participantsSchema = new Schema({
    _id: { auto: false },
    id: {
        type: Schema.Types.ObjectId, required: true, index: true, ref: 'participants',
    },
    answerId: {
        type: Schema.Types.ObjectId, required: true, ref: 'answers',
    },
}, {
    timestamps: false,
});

const filesSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId, auto: true,
    },
    name: {
        type: String, required: true,
    },
    type: {
        type: String, required: true, enum: ['audio', 'image', 'video', 'unknown'], default: 'unknown',
    },
}, {
    timestamps: true,
});

const schema = new Schema({
    name: {
        type: String, required: true,
    },
    description: {
        type: String, required: true,
    },
    active: {
        type: Boolean, required: true, default: false, index: true,
    },
    scheduling: {
        start: {
            type: Number, default: null,
        },
        end: {
            type: Number, default: null,
        },
    },
    settings: {
        randomOption: {
            type: Boolean, required: true, default: true,
        },
        showScore: {
            type: Boolean, required: true, default: true,
        },
    },
    question: {
        sections: [{ type: sectionSchame }],
        parts: [{ type: partSchame }],
    },
    participants: [{ type: participantsSchema }],
    files: [{ type: filesSchema }],
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('tests', schema);

export default Model;
