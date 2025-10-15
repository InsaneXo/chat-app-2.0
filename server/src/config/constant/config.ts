const corsOptions:any = {
    origin: [
        "http://localhost:5173",
        process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

export { corsOptions }