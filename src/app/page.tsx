"use client"; // <--- Thêm dòng này vào đầu file là hết lỗi ngay!

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [message, setMessage] = useState("Đang chờ Backend...");

    useEffect(() => {
        fetch("/api/py/status")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => setMessage("Lỗi rồi xám cưng ơi: " + err));
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-2xl font-bold">Thành phố Eco-Citizen</h1>
                <p className="bg-blue-100 p-4 rounded-lg text-blue-800 mt-4">
                    Thông báo từ Backend: {message}
                </p>
            </div>
            {/* Các thành phần khác của xám cưng */}
        </main>
    );
}
