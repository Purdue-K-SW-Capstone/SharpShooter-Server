import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import path from 'path';
import { Targets } from "./entities/Targets";
import { Calibers } from "./entities/Calibers";

// set .env for Secret variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// TypeORM setting for DB
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Targets, Calibers],
    subscribers: [],
    migrations: [],
});