// export const corsOptions = {
//   origin: "https://frontendmain-git-master-jugalnoobs-projects.vercel.app",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
// };



const allowedOrigins = [
  "http://localhost:5173",
  "https://frontendmain-git-master-jugalnoobs-projects.vercel.app"
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"]
};