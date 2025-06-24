"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Transaction_1 = require("../entities/Transaction");
const envs_1 = require("./envs");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: envs_1.envs.DATABASE_HOST,
    port: envs_1.envs.DATABASE_PORT,
    username: envs_1.envs.DATABASE_USERNAME,
    password: envs_1.envs.DATABASE_PASSWORD,
    database: envs_1.envs.DATABASE_NAME,
    synchronize: true,
    logging: false,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [User_1.User, Transaction_1.Transaction],
});
