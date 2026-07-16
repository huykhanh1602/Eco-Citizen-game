import { MongoClient, Db, Collection } from "mongodb";

export interface LocalizedText {
  vi: string;
  en: string;
}

export interface GameEvent {
  _id: string;
  title: LocalizedText;
  persona: LocalizedText;
  avatarUrl: string;
  description: LocalizedText;
  event_context: LocalizedText;
  scientific_rules: LocalizedText;
  severity: number;
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Không tìm thấy cấu hình MONGO_URI trong file .env!");
}

const DATABASE_NAME = "ECO_CITIZEN";
const COLLECTION_NAME = "eventBanks";

let db: Db;
let client: MongoClient;

export async function connectToDatabase(): Promise<void> {
  if (db) return;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    console.log(" Đã kết nối thành công tới MongoDB Atlas!");
  } catch (error) {
    console.error(" Lỗi kết nối MongoDB Atlas:", error);
    throw error;
  }
}

export async function getRandomEvent(): Promise<GameEvent | null> {
  if (!db) {
    await connectToDatabase();
  }
  const collection: Collection<GameEvent> = db.collection(COLLECTION_NAME);
  try {
    const result = await collection.aggregate<GameEvent>([
      { $sample: { size: 1 } }
    ]).toArray();

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Lỗi khi lấy sự kiện:", error);
    return null;
  }
}