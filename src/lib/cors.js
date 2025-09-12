const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3001",
  "https://www.shikshart.com",
  "https://shikshart.com",
  "https://shikshart-gamified-lms.vercel.app",
  "https://shikshartgamifiedlms.onrender.com",
];


const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin:", origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

export default corsOptions;
