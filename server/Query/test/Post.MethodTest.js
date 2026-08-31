import autocannon from "autocannon";

const url = "http://localhost:9000/login";

const instance = autocannon({
  url,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "test@example.com",
    password: "123456"
  }),
  connections: 50,  // concurrent users
  duration: 10      // seconds
}, console.log);

autocannon.track(instance, { renderProgressBar: true });
