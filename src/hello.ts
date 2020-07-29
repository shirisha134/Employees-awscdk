const SITE_NAME = process.env.SITE_NAME || "";

export const handler = async (): Promise<any> => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello and Welcome to our Serverless Application! \n welcome to site : ${SITE_NAME}`
  };
};
