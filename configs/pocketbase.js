import PocketBase from "pocketbase";
const client = new PocketBase(process.env.URL_POCKETBASE);

await client.admins.authWithPassword(
  process.env.EMAIL_POCKETBASE,
  process.env.PASSWORD__POCKETBASE
);
client.autoCancellation(false);

export default client;
