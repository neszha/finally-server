import mongoose, { Schema } from 'mongoose';

const answerSchame = new Schema({
    _id: {
        type: Schema.Types.ObjectId, auto: false,
    },
    key: {
        type: Number, required: true,
    },
    content: {
        type: String, required: true,
    },
    isTrue: {
        type: Boolean, required: true, default: false,
    },
}, {
    timestamps: false,
});

const schema = new Schema({
    order: {
        type: Number, required: true, default: 0,
    },
    no: {
        type: Number, default: null,
    },
    name: {
        type: String, required: true, default: 'Untitled question (1)',
    },
    contentOnly: {
        type: Boolean, required: true, default: false,
    },
    type: {
        type: String,
        required: true,
        index: true,
        enum: ['intruction', 'question-only', 'multiple-choice', 'error-identification'],
        default: 'multiple-choice',
    },
    content: {
        type: String, default: '',
    },
    answers: [{ type: answerSchame }],
    testId: {
        type: Schema.Types.ObjectId, required: true, index: true, ref: 'tests',
    },
    sectionId: {
        type: Schema.Types.ObjectId, required: true,
    },
    partId: {
        type: Schema.Types.ObjectId, required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('questions', schema);

export default Model;
