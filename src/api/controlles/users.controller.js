import { UserModel } from '../../models/index.js';
import { responseHelper, jwtHelper } from '../../helpers/index.js';

// const { isObjectId } = validatorHelper;
const { badRequest, success } = responseHelper.api;

export default {

    /**
     * Method: GET
     */
    getSession(req, res) {
        res.json({ data: req.user });
    },

    /**
     * Method: POST
     */
    async register(req, res) {
        const { body } = req;

        // Validate password.
        if (!body.password) return badRequest(res);
        if (body.password !== body.passwordRepeat) return badRequest(res, 'Password tidak sama!');

        // Check username.
        const usernameCount = await UserModel.count({ username: body.username });
        if (usernameCount) return badRequest(res, 'Username telah digunakan!');

        // Generate post user.
        const user = new UserModel(body);
        await user.save();

        // Send response.
        return success(res, 'Pendaftaran berhasil!');
    },

    async login(req, res) {
        const { username, password } = req.body;

        // Validate body.
        if (!username || !password) return badRequest(res);

        // Get and validate account.
        const user = await UserModel.findOne({ username }, { name: 1, username: 1, password: 1 }).lean();
        if (!user || user.password !== password) return badRequest(res, 'Username atau password tidak valid!');

        // Generate token.
        const payload = {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
        };
        const token = jwtHelper.sign(payload);

        // Send response.
        return res.cookie('token', token)
            .json({ msg: 'Login berhasil.' });
    },

    logout(req, res) {
        res.clearCookie('token').json({ msg: 'Logout berhasil.' });
    },

    /**
     * Method: PUT
     */

    /**
     * Method: PATCH
     */

    /**
     * Method: DELETE
     */
};
