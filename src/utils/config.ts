import "dotenv/config";

const e = process.env;

// Port Number for app
export const PORT = e.PORT;

export const NODE_ENV = e.NODE_ENV;

export const DB_NAME = e.DB_NAME;
export const DB_HOST = e.DB_HOST;
export const DB_PORT = Number(e.DB_PORT);
export const DB_USER = e.DB_USER;
export const DB_PASSWORD = e.DB_PASSWORD;

export const SECRET = e.SECRET;

export const KEY_FILE = e.KEY_FILE as string;
export const CERT_FILE = e.CERT_FILE as string;
