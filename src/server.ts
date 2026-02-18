import "dotenv/config";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { app } from "./app";

app.listen(env.port, () => {
  logger.info({ port: env.port }, "HTTP server running");
});
