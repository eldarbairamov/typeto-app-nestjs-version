import process from "process";

export default () => ({
   SOCKET_PORT: process.env.SOCKET_PORT || 3200,

   POSTGRES_DB: process.env.POSTGRES_DB,
   POSTGRES_HOST: process.env.POSTGRES_HOST,
   POSTGRES_USER: process.env.POSTGRES_USER,
   POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
   POSTGRES_PORT: process.env.POSTGRES_PORT,
})