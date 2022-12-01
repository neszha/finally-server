import mongoose, { Schema } from 'mongoose';

const sectionSchame = new Schema({
    _id: { auto: false },
    startedAt: {
        type: Number, default: null,
    },
    finishedAt: {
        type: Number, default: null,
    },
    correctAmount: {
        type: Number, required: true, min: 0, default: 0,
    },
    score: {
        type: Number, required: true, min: 0, default: 0,
    },
    sectionId: {
        type: Schema.Types.ObjectId, required: true,
    },
}, {
    timestamps: false,
});

const answerSchame = new Schema({
    _id: { auto: false },
    myAnswerKey: {
        type: Number, default: null,
    },
    correct: {
        type: Boolean, required: true, default: false,
    },
    questionId: {
        type: Schema.Types.ObjectId, required: true, ref: 'participants',
    },
}, {
    timestamps: false,
});

const schema = new Schema({
    startedAt: {
        type: Number, default: null,
    },
    finishedAt: {
        type: Number, default: null,
    },
    sections: [{ type: sectionSchame }],
    answers: [{ type: answerSchame }],
    testId: {
        type: Schema.Types.ObjectId, required: true, index: true, ref: 'tests',
    },
    participantId: {
        type: Schema.Types.ObjectId, required: true, index: true, ref: 'participants',
    },
    finalScore: {
        type: Number, required: true, min: 0, default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('answers', schema);

export default Model;
