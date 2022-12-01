import { stringValidator } from '../../validations/index.js';
import { AnswerModel, TestModel } from '../../models/index.js';
import { jwtHelper, responseHelper } from '../../helpers/index.js';

const { unauthorized, sendInvalidMessage } = responseHelper;

const $m = {

    validateDecodedIds(decoded) {
        const ids = [decoded.id, decoded.testId, decoded.answerId];
        return stringValidator.isObjectId(ids);
    },

    async calcTestScheduling(payload) {
        const { testId } = payload;
        const scheduling = {
            valid: false, // bool
            status: null, // null|waiting|running|finish
            data: {}, // Store scheduling data
        };

        // Get test and validate it.
        const timeNow = new Date().getTime();
        const test = await TestModel.findOne({ _id: testId }, { scheduling: 1 }).lean();
        if (!test) return scheduling;
        const { start, end } = test.scheduling;
        if (!start || !end) return scheduling;
        scheduling.valid = true;

        // Calculate test scheduling status.
        if (timeNow < start) scheduling.status = 'waiting';
        else if (timeNow >= end) scheduling.status = 'finish';
        else scheduling.status = 'running';
        scheduling.data = { ...test.scheduling };

        // Result.
        return scheduling;
    },

};

export default {
    /**
     * Access Lavel 1: For participant after login.
     *
     * Rule as: ['participant']
     */
    entered(req, res, next) {
        const { token } = req.cookies;
        const allowRules = ['participant'];

        // Validate token.
        if (!token) return unauthorized(res);
        const decoded = jwtHelper.verify(token);
        if (!decoded || allowRules[0] !== decoded.rule) return unauthorized(res);

        // Validate ids in decoded.
        if (!$m.validateDecodedIds(decoded)) return sendInvalidMessage(res, 'Sesi login tidak valid!');

        // Participant mush be entered.
        if (!decoded.auths.login) return unauthorized(res);

        // To next step.
        req.payload = decoded;
        return next();
    },
    /**
     * Access Lavel 2: For participant after confirmed test and token.
     *
     * Rule as: ['participant']
     */
    async confirmed(req, res, next) {
        const { token } = req.cookies;
        const allowRules = ['participant'];

        // Validate token.
        if (!token) return unauthorized(res);
        const decoded = jwtHelper.verify(token);
        if (!decoded || allowRules[0] !== decoded.rule) return unauthorized(res);

        // Validate ids in decoded.
        if (!$m.validateDecodedIds(decoded)) return sendInvalidMessage(res, 'Sesi login tidak valid!');

        // Token mush be confirmed.
        if (!decoded.auths.token) return unauthorized(res);

        // Validate test scheduling.
        const scheduling = await $m.calcTestScheduling(decoded);
        if (!scheduling.valid) return sendInvalidMessage(res, 'Penjadwalan tes tidak valid!');
        if (scheduling.status === 'waiting') return sendInvalidMessage(res, 'Tes belum terbuka!');
        if (scheduling.status === 'finish') return sendInvalidMessage(res, 'Tes telah berakhir!');

        // To next step.
        req.payload = decoded;
        req.scheduling = scheduling;
        return next();
    },

    /**
     * Access Lavel 3: For participant after start the test.
     *
     * Rule as: ['participant']
     */
    async started(req, res, next) {
        const { token } = req.cookies;
        const allowRules = ['participant'];

        // Validate token.
        if (!token) return unauthorized(res);
        const decoded = jwtHelper.verify(token);
        if (!decoded || allowRules[0] !== decoded.rule) return unauthorized(res);

        // Validate ids in decoded.
        if (!$m.validateDecodedIds(decoded)) return sendInvalidMessage(res, 'Sesi token tidak lagi valid!');

        // Token mush be confirmed.
        if (!decoded.auths.start) return unauthorized(res);

        // Validate test scheduling.
        // const scheduling = await $m.calcTestScheduling(decoded);
        // if (!scheduling.valid) return sendInvalidMessage(res, 'Penjadwalan tes tidak valid!');
        // if (scheduling.status === 'waiting') return sendInvalidMessage(res, 'Tes belum terbuka!');
        // if (scheduling.status === 'finish') return sendInvalidMessage(res, 'Tes telah berakhir!');

        // Check finishedAt and auth finish.
        const { auths } = decoded;
        const answer = await AnswerModel.findOne({ _id: decoded.answerId }, { finishedAt: 1 }).lean();
        if (!answer) return unauthorized(res, true, true);
        if (auths.finish || answer.finishedAt) return sendInvalidMessage(res, 'Tes telah diselesaikan!');

        // To next step.
        req.payload = decoded;
        // req.scheduling = scheduling;
        return next();
    },

    /**
     * Access Lavel 4: For participant after finished the test.
     *
     * Rule as: ['participant']
     */
    async finished(req, res, next) {
        const { token } = req.cookies;
        const allowRules = ['participant'];

        // Validate token.
        if (!token) return unauthorized(res);
        const decoded = jwtHelper.verify(token);
        if (!decoded || allowRules[0] !== decoded.rule) return unauthorized(req, true, true);

        // Validate ids in decoded.
        if (!$m.validateDecodedIds(decoded)) return sendInvalidMessage(res, 'Sesi token tidak lagi valid!');

        // Check finishedAt.
        const answer = await AnswerModel.findOne({ _id: decoded.answerId }, { finishedAt: 1 }).lean();
        if (!answer) return unauthorized(res, true, true);

        // Check finishedAt and auth finish.
        if (!answer.finishedAt && !decoded.auths.finish) return unauthorized(res);

        // To next step.
        req.payload = decoded;
        return next();
    },

};
