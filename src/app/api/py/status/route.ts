import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "Running",
        message: "API is up and running",
    });
}
