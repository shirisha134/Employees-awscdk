const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (): Promise<any> => {
  const siteName = TABLE_NAME.split("_")[0];
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello and Welcome to our Serverless Application! \n welcome to site : ${siteName}`
  };
};
