const getOrigins = () => {
  if (process.env.NODE_ENV === "production") {
    return [process.env.FRONTEND_URL as string];
  }

  return [process.env.DEV_FRONTEND_URL || "http://localhost:3000"];
};

export const allowedOrigins = getOrigins();
