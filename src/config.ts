import dotenv from 'dotenv';
dotenv.config();

export const TOKEN = process.env.TOKEN;
export const APP_ID = process.env.APP_ID;
export const TEST_SERVER_ID = process.env.TEST_SERVER_ID;
export const CLIENT_ID = process.env.CLIENT_ID;

export const getFormattedDate = async (): Promise<string> => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

