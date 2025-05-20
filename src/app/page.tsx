"use client";

import DefaultLayout from "@/components/layout/defaultLayout";
import Link from "next/link";

export default function Home() {
  return (
    <DefaultLayout>
      <main className="container mx-auto mt-8">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-4">Welcome to Forum App</h1>
          <p className="mb-4">
            Join discussions, share ideas, and connect with others.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/topics"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Topics
            </Link>
            <Link
              href="/subjects"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Subjects
            </Link>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
}
