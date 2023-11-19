"use client"
import Loading from "@/app/components/Loading";

export default function Loader() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
            <Loading />
        </div>
        </main>
    );
}