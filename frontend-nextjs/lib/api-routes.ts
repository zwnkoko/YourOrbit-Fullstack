const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiRoutes = {
  jobAppTracker: {
    extractText: `${BASE_URL}/job-app-tracker/extract-text`,
  },
};
