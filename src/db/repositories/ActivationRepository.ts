
import { Pool } from "mysql2/promise";
import MySQLConnector from "../Connect.js";

export interface DeviceActivation {
    id: number;
    license_id: number;
    device_identifier: string;
    user_name?: string;
    activated_at: Date;
}

export default class ActivationRepository {
    private db: Pool;
    constructor() {
        this.db = MySQLConnector.getInstance().getPool();
    }

    
}