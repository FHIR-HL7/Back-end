import { MongoClient } from "mongodb";
 
const url = "mongodb://localhost:27017";
const dbName = "ehrDB";
 
const client = new MongoClient(url);
export const database = client.db(dbName);