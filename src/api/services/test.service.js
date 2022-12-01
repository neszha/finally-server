import { TestModel, QuestionModel, AnswerModel } from '../../models/index.js';

export default {

    async rebuildQuestionsOrder(partId) {
        const promises = [];
        const questions = await QuestionModel.find({ partId }, { order: 1 }).sort('order').lean();
        questions.forEach((item, index) => {
            const query = QuestionModel.updateOne({ _id: item._id }, { order: index }).exec();
            promises.push(query);
        });
        await Promise.all(promises);
    },

    async rebuildQuestionsNumber(testId, sectionId) {
        const promises = [];
        const test = await TestModel.findOne({ _id: testId }).lean();
        if (!test) return;
        const parts = test.question.parts
            .filter((item) => item.sectionId.toString() === sectionId)
            .sort((a, b) => a.order - b.order);
        const questions = await QuestionModel.find({ sectionId, contentOnly: false }, { content: 0, answers: 0 }).sort('order').lean();
        let number = 1;
        parts.forEach((part) => {
            const questionsPart = questions.filter((item) => item.partId.toString() === part._id.toString());
            questionsPart.forEach((question) => {
                const query = QuestionModel.updateOne({ _id: question._id }, { no: number }).exec();
                promises.push(query);
                number += 1;
            });
        });
        await Promise.all(promises);
    },

    async rebuildScoreTable(testId, sectionId) {
        const test = await TestModel.findOne({ _id: testId });
        if (!test) return false;
        const section = test.question.sections.find((item) => item._id.toString() === sectionId);
        if (!section) return false;
        const questionCounter = await QuestionModel.count({ sectionId, contentOnly: false });
        for (let i = 0; i < Math.abs(section.scores.length - (questionCounter + 10)); i += 1) {
            section.scores.push(null);
        }
        section.scores = section.scores.slice(0, questionCounter + 1);
        await test.save();
        return true;
    },

    async calculateTestScore(testId, answerId) {
        // Get answer.
        const answersObj = {}; // {questionId: question}
        const answer = await AnswerModel.findOne({ _id: answerId });
        answer.answers.forEach((item) => {
            answersObj[item.questionId] = item;
        });

        // Get questions test.
        const questions = await QuestionModel.find({ testId }, { answers: 1, sectionId: 1 }).lean();

        // Get test data.
        const test = await TestModel.findOne({ _id: testId }, { 'question.sections': 1 }).lean();
        const { sections } = test.question;

        // Caculate correct amount in sections.
        sections.forEach((section) => {
            section.correctAmount = 0;
            const sectionId = section._id.toString();
            const sectionQuestions = questions.filter((item) => item.sectionId.toString() === sectionId);
            sectionQuestions.forEach((question) => {
                const questionId = question._id.toString();
                const myAnswer = answersObj[questionId];
                if (myAnswer) {
                    const answerKey = question.answers.find((item) => item.isTrue);
                    if (answerKey) {
                        if (myAnswer.myAnswerKey === answerKey.key) {
                            myAnswer.correct = true;
                            section.correctAmount += 1;
                        }
                    }
                }
            });
        });

        // Calculate final score.
        let finalScore = 0;
        sections.forEach((section) => {
            const sectionId = section._id.toString();
            const score = section.scores[section.correctAmount] || 0;
            const answerSection = answer.sections.find((item) => item.sectionId.toString() === sectionId);
            if (answerSection) {
                answerSection.correctAmount = section.correctAmount;
                answerSection.score = score;
                finalScore += score * 10;
            }
        });
        answer.finalScore = Math.abs((finalScore / sections.length)) || 0;
        await answer.save();

        // Update final score.
        await AnswerModel.updateOne({ _id: answerId }, { $set: { finalScore: answer.finalScore } }).exec();

        // Send return.
        return answer.finalScore;
    },

};
