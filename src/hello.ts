const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (): Promise<any> => {
  console.log("Table detials", TABLE_NAME);
  const siteName = TABLE_NAME.split("_")[0];
  console.log("site details", siteName);
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello and Welcome to our Serverless Application! \n welcome to site : ${siteName}`
  };
};
