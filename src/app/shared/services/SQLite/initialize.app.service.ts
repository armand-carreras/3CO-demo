import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { LabelSQLiteHandlerService } from './label-sqlite-handler.service';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class InitializeAppService {

    isAppInit: boolean = false;
    platform!: string;

    constructor(
        private sqliteService: SQLiteService,
        private storageService: LabelSQLiteHandlerService,
        ) {

    }

    async initializeApp() {
        await this.sqliteService.initializePlugin().then(async (ret) => {
            this.platform = this.sqliteService.platform;
            try {
                const DB = 'ecodatabase'
                if( this.sqliteService.platform === 'web') {
                    await this.sqliteService.initWebStore();
                    // Import pre-populated data if not already imported
                    await this.importWebDatabase();
                    await this.storageService.initializeDatabase(DB);
                    await this.sqliteService.saveToStore(DB);
                } else {
                    await this.storageService.initializeDatabase(DB);
                    
                }
                
                this.isAppInit = true;

            } catch (error) {
                console.log(`initializeAppError: ${error}`);
                await Toast.show({
                text: `initializeAppError: ${error}`,
                duration: 'long'
                });
            }
        });
    }

    /**
     * For web platform, import the pre-populated database from the JSON asset
     * if the database doesn't already have data.
     * Uses a direct fetch + sql.js approach to avoid jeep-sqlite import bugs
     * with column names containing special characters.
     */
    private async importWebDatabase(): Promise<void> {
        try {
            const dbName = 'ecodatabase';
            const dbExists = (await this.sqliteService.sqliteConnection.isDatabase(dbName)).result;
            
            if (!dbExists) {
                console.log('Importing pre-populated database for web...');
                const response = await fetch('assets/databases/ecodatabase.json');
                if (response.ok) {
                    const jsonData = await response.json();
                    
                    // Create a temp connection to import data, then clean up properly
                    const db = await this.sqliteService.sqliteConnection.createConnection(
                        dbName, false, 'no-encryption', 1, false
                    );
                    await db.open();
                    
                    for (const table of jsonData.tables) {
                        const colDefs = table.schema.map((s: any) => `${s.column} ${s.value}`);
                        const createSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (${colDefs.join(', ')})`;
                        await db.execute(createSQL);
                        
                        const colNames = table.schema.map((s: any) => s.column);
                        const placeholders = colNames.map(() => '?').join(', ');
                        const insertSQL = `INSERT INTO ${table.name} (${colNames.join(', ')}) VALUES (${placeholders})`;
                        
                        // Wrap all inserts in a single transaction for performance
                        await db.beginTransaction();
                        let inserted = 0;
                        for (const row of table.values) {
                            try {
                                await db.run(insertSQL, row, false);
                                inserted++;
                            } catch (rowErr) {
                                console.warn(`Skipping row ${inserted + 1} in ${table.name}:`, rowErr);
                            }
                        }
                        await db.commitTransaction();
                        console.log(`Imported ${inserted}/${table.values.length} rows into ${table.name}`);
                    }
                    
                    // Properly close and remove connection from dict to avoid stale refs
                    await this.sqliteService.sqliteConnection.closeConnection(dbName, false);
                } else {
                    console.warn('Pre-populated database asset not found, starting with empty DB');
                }
            } else {
                console.log('Database already exists, skipping import');
            }
        } catch (err) {
            console.warn('Web database import skipped:', err);
        }
    }

}

