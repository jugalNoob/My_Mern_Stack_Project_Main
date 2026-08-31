import autocannon from "autocannon";

const url = "http://localhost:8000/get?name&email&country&bloodGroup&page=1&limit=10"; // your GET API

// Function to run the test
const run = async () => {
  console.log("🚀 Starting load test...");

  const instance = autocannon({
    url,
    method: "GET",        // GET requests
    connections: 50,      // 50 concurrent users
    duration: 50,         // run for 10 seconds
    headers: {
      "Accept": "application/json",
    }
  }, (err, result) => {
    if (err) console.error(err);
    else console.log("✅ Test finished", result);
  });

  // Show live progress
  autocannon.track(instance, { renderProgressBar: true });
};

run();


// node loadTest.js
