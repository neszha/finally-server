export default {

    errorQuery(res, err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((val) => val.message);
            return res.json({ success: false, msg: errors });
        }
        return res.json({ success: false, data: [] });
    },

    handdler(res, err, data, sendData = false, msg = 'success') {
        if (err) return this.errorQuery(res, err);
        if (sendData) return res.json({ success: true, data });
        return res.json({ success: true, msg });
    },

    sendInvalidMessage(res, msg = 'Invalid response!') {
        return res.json({ success: false, msg });
    },

    invalidReqParameters(res, msg = 'Parameter yang dikirim tidak valid!') {
        return res.json({ success: false, msg });
    },

    invalidQueryData(res) {
        return res.json({ success: false, msg: 'Data yang dikirim tidak dapat diperoses!' });
    },

    unauthorized(res, useStatus = true, logoutForce = false) {
        if (useStatus) res.statusCode = 401;
        if (logoutForce) res.clearCookie('token');
        return res.json({ success: false, msg: 'Unauthorized access.' });
    },

    notAllowed(res) {
        res.statusCode = 401;
        return res.json({ success: false, msg: 'Akses ke dalam resource tidak diizikan.' });
    },

    operationNotAllowed(res) {
        res.statusCode = 401;
        return res.json({ success: false, msg: 'Operasi tidak diizinkan.' });
    },

};
