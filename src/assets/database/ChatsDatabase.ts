import { addRxPlugin, createRxDatabase } from "rxdb";
import { getRxStoragePouch, addPouchPlugin } from "rxdb/plugins/pouchdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
addPouchPlugin(require("pouchdb-adapter-idb"));
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBReplicationCouchDBPlugin);
// addRxPlugin(RxDBNoValidatePlugin);

const chatsListSchema = {
  title: "chats list schema",
  version: 0,
  description: "list of chats on main page",
  primaryKey: "chatId",
  type: "object",
  properties: {
    chatId: {
      type: "string",
    },
    lastMessage: {
      type: "object",
      properties: {
        mes: {
          type: "string",
        },
        time: {
          type: "number",
        },
        read: {
          type: "boolean",
        },
      },
    },
    name: {
      type: "string",
    },
    profileImage: {
      type: "string",
    },
  },
  required: ["chatId", "name"],
};

const chatsSchema = {
  title: "chats  schema",
  version: 0,
  description: "all chats",
  primaryKey: "messageId",
  type: "object",
  properties: {
    messageId: {
      type: "string",
    },
    from: {
      type: "string",
    },
    message: {
      type: "object",
      properties: {
        mes: {
          type: "string",
        },
        time: {
          type: "number",
        },
        type: {
          type: "string",
        },
      },
    },
  },
  required: ["messageId", "from"],
};

let dbPromise: any = null;

const _create = async () => {
  console.info("DatabaseService: creating database");
  const db = await createRxDatabase({
    name: "chats",
    storage: getRxStoragePouch("idb"),
    multiInstance: false,
    ignoreDuplicate: true,
  }).then((db) => {
    console.info("DatabaseService: created database");
    return db;
  });

  await db.waitForLeadership().then(() => {
    console.info("isLeader now");
  });

  console.info("DatabaseService: creating collections");
  await db.addCollections({
    chatslist: {
      schema: chatsListSchema,
    },
    chats: {
      schema: chatsSchema,
    },
  });
  console.info("DatabaseService: created collection");

  return db;
};

export const get = () => {
  if (!dbPromise) dbPromise = _create();
  return dbPromise;
};
