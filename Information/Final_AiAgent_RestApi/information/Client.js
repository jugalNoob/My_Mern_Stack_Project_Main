// RestApi_Tool/restapi.js

import { RegisterGet } from "../server/model/student.js";
import redisClient from "../../Config/redis/redis.js";


export async function finduser(name) {

    console.log(
        `[TOOL] Searching student: "${name}"`
    );

    try {

        // --------------------------------
        // 1. Create safe cache key
        // --------------------------------

        const userKey =
            `student:name:${name.toLowerCase().trim()}`;


        // --------------------------------
        // 2. Check Redis
        // --------------------------------

        const cachedUser =
            await redisClient.get(userKey);


        if (cachedUser) {

            console.log(
                `[REDIS HIT] ${userKey}`
            );

            return cachedUser;
        }


        console.log(
            `[REDIS MISS] ${userKey}`
        );


        // --------------------------------
        // 3. Search MongoDB
        // --------------------------------

        const escapedName =
            name.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const nameRegex =
            new RegExp(escapedName, "i");


        const users =
            await RegisterGet
                .find({
                    name: nameRegex
                })
                .select(
                    "name age email country bloodGroup hobbies bio"
                )
                .limit(5)
                .lean();


        // --------------------------------
        // 4. No result
        // --------------------------------

        if (users.length === 0) {

            const result =
                "No matching users found in database.";

            // Optional null caching
            await redisClient.setEx(
                userKey,
                30,
                result
            );

            return result;
        }


        // --------------------------------
        // 5. Prepare safe result
        // --------------------------------

        const result =
            JSON.stringify(
                users.map(user => ({
                    name: user.name,
                    age: user.age,
                    email: user.email,
                    country: user.country,
                    bloodGroup: user.bloodGroup,
                    hobbies: user.hobbies,
                    bio: user.bio
                }))
            );


        // --------------------------------
        // 6. Store in Redis
        // --------------------------------

        await redisClient.setEx(
            userKey,
            50,
            result
        );


        console.log(
            `[REDIS SET] ${userKey}`
        );


        return result;


    } catch (error) {

        console.error(
            "[finduser ERROR]",
            error
        );

        return `Database error: ${error.message}`;
    }
}