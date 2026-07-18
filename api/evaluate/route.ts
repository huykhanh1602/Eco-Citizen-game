import { NextResponse } from 'next/server';
import { getRandomEvent } from '@/utils/db'; // Đường dẫn trỏ tới file db.ts của bạn

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const event = await getRandomEvent();
    
    if (!event) {
      return NextResponse.json({ error: "Không tìm thấy sự kiện nào trong database." }, { status: 404 });
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error("Lỗi API lấy sự kiện:", error);
    return NextResponse.json({ error: "Lỗi kết nối database phía server." }, { status: 500 });
  }
}