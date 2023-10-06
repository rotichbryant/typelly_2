import { registerAs } from "@nestjs/config"

export default registerAs('app',() => ({
    key: process.env.APP_KEY,
    jwt: {
        expiry: process.env.JWT_SESSION_EXPIRES,
        key: process.env.JWT_SESSION_KEY,
    }
}));