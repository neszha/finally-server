import { UserModel } from '../../models/index.js';
import { responseHelper, validatorHelper } from '../../helpers/index.js';

const { isObjectId } = validatorHelper;
const { badRequest, success } = responseHelper.api;

export default {

    /**
     * Method: GET
     */

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
