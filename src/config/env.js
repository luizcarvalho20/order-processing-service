"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function requireEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env var: ${name}`);
    return v;
}
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: requireEnv("DATABASE_URL"),
};
//# sourceMappingURL=env.js.map