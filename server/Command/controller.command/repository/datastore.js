import {RegisterGet} from '../../Model/Student.js';

export const createUserService = async (data) => {

    try {
          return await user.create(data);

    } catch (error) {
    console.log(error)
    }

};
