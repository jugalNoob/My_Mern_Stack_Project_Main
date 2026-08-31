let count = 0;  // Keep track of the number of requests

// Middleware only for `/home`export 
 export const getCountResquest = (req, res, next) => {
    count++;  // Increment the request count for `/home`

    // Log details of the request
    const log = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        count,
    };

    // Log to console
    console.log(`[HOME] ${log.timestamp} | ${log.method} ${log.url} | Visit #: ${log.count}`);

    // Attach log and count to the request
    req.log = log;
    req.count = count;

    // Measure the response time
    const start = Date.now();

    // The response "finish" event to calculate the duration
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[HOME] Response took ${duration}ms`);

        // Attach duration to the request object to be sent in the response
       req.duration = duration;
    });

    next();  // Continue to the next middleware or route handler
};


