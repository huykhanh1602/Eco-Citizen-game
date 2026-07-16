import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "ECO_CITIZEN";
const COLLECTION_NAME = "eventBanks";

if (!MONGO_URI) {
  throw new Error("Không tìm thấy cấu hình MONGO_URI trong file .env!");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGO_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URI);
  clientPromise = client.connect();
}

export async function GET() {
  try {
    // 1. Kết nối tới MongoDB Atlas
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const randomEvents = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();

    console.log("=== DỮ LIỆU TỪ MONGODB ATLAS ===");
    console.log(JSON.stringify(randomEvents, null, 2));
    console.log("=================================");

    if (!randomEvents || randomEvents.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy sự kiện nào trong cơ sở dữ liệu!" },
        { status: 404 }
      );
    }

    // 4. Trả về sự kiện ngẫu nhiên đầu tiên tìm được
    const selectedEvent = randomEvents[0];

    // Trả về dữ liệu thành công cho Client dưới dạng JSON
    return NextResponse.json(selectedEvent);
  } catch (error: any) {
    console.error("Lỗi khi truy vấn sự kiện ngẫu nhiên từ MongoDB:", error);
    return NextResponse.json(
      { error: "Lỗi kết nối hoặc truy vấn cơ sở dữ liệu", details: error.message },
      { status: 500 }
    );
  }
}