import { db } from "./db.js";
import { scans, type InsertScan, type Scan } from "../shared/schema.js";

export interface IStorage {
  logScan(scan: InsertScan): Promise<Scan>;
  getRecentScans(limit?: number): Promise<Scan[]>;
}

export class DatabaseStorage implements IStorage {
  async logScan(scan: InsertScan): Promise<Scan> {
    const [newScan] = await db.insert(scans).values(scan).returning();
    return newScan;
  }

  async getRecentScans(limit = 10): Promise<Scan[]> {
    return await db.select().from(scans).limit(limit).orderBy(scans.createdAt);
  }
}

export const storage = new DatabaseStorage();
