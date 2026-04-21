import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        // Nếu đang chạy ở máy cá nhân (chế độ development)
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/api/py/:path*",
                    destination: "http://127.0.0.1:8000/api/py/:path*", // Chỉ chọc vào cổng 8000 khi ở local
                },
            ];
        }

        // Nếu đang trên Vercel (chế độ production), không làm gì cả,
        // để Vercel tự xử lý thông qua vercel.json
        return [];
    },
    reactCompiler: true,
};

export default nextConfig;
