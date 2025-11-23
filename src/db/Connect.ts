import mysql from 'mysql2/promise';
import fs from 'fs/promises';

export default class MySQLConnector {

    private connection: mysql.Pool;
    private static instance: MySQLConnector;

    private constructor() { }

    public static getInstance(): MySQLConnector {
        if (!MySQLConnector.instance) {
            MySQLConnector.instance = new MySQLConnector();
        }
        return MySQLConnector.instance;
    }

    public async disconnect(): Promise<void> {
        try {
            await this.connection.end();
            console.log('✔️  Disconnected from MySQL');
        }
        catch (err: any) {
            console.error('Error disconnecting from MySQL: ', err);
        }
    }

    public async connect(): Promise<void> {
        try {
            this.connection = await mysql.createPool({
                host: process.env.MYSQL_HOST,
                port: parseInt(process.env.MYSQL_PORT || '3306'),
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
            });
            console.log('✔️  Connected to MySQL');

            await this.createTables();

        } catch (err: any) {
            throw new Error(`Error connecting to MySQL: ${err}`);
        }
    }

    public getPool(): mysql.Pool {
        return this.connection;
    }

    private async createTables(): Promise<void> {
        const schemasPath = new URL('./schemas/', import.meta.url).pathname;
        
        const activationSchema = await fs.readFile(
            `${schemasPath}DeviceActivations.sql`, 
            'utf8'
        );

        const licenseSchema = await fs.readFile(
            `${schemasPath}License.sql`, 
            'utf8'
        );

        await Promise.allSettled([
            this.connection.query(licenseSchema),
            this.connection.query(activationSchema),
        ]);



    }


    
}