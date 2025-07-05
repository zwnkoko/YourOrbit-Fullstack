import dotenv from "dotenv";

// Load the appropriate .env file
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
  console.log("Using .env.production");
} else {
  dotenv.config();
  console.log("Using .env");
}

function checkEnvVars(vars: string[]) {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(
      `\n❌ Missing required environment variables: ${missing.join(", ")}\n` +
        "Please create a .env file based on .env.example and fill in the missing values.\n" +
        "See the README for more details.\n"
    );
    process.exit(1);
  }
}

checkEnvVars(["BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "DATABASE_URL"]);

import app from "./app";
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
