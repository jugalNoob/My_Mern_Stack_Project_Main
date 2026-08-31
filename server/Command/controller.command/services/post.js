// import { createUserService } from '../repository/datastore.js'
import { prodcuerService } from '../Store.Producer/Store.js'

export const createUser = async (req, res) => {

    try {

        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            })
        }

        // const result = await createUserService({ name, email });

        const producerResult = await prodcuerService({ name, email });

        res.status(201).json({
            success: true,
            mongo: result,
            kafka: producerResult
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}