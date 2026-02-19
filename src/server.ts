// src/server.ts
import "dotenv/config";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { app } from "./app";

// ✅ Só sobe o servidor quando executado diretamente (npm run dev / start)
if (require.main === module) {
  app.listen(env.port, () => {
    logger.info({ port: env.port }, "HTTP server running");
  });
}
