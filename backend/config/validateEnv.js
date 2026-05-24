const validateEnv = () => {
    const requiredVars = ["PORT", "CONNECTION_STRING", "ACCESS_TOKEN_SECRET"];
    const missingVars = requiredVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(", ")}`
        );
    }
};

module.exports = validateEnv;
