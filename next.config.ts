import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    async rewrites() {
        // Nếu đang chạy ở máy cá nhân (chế độ development)
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/api/py/:path*",
                    destination: "/api/index.py", // Chỉ chọc vào cổng 8000 khi ở local
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
