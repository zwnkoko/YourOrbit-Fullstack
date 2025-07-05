const getOrigins = () => {
  if (process.env.NODE_ENV === "production") {
    return [process.env.FRONTEND_URL as string];
  }

  return ["http://localhost:3000"];
};

export const allowedOrigins = getOrigins();
