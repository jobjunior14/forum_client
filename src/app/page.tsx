import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <Link href="/" className="text-xl font-bold">
            Forum App
          </Link>
          <div>
            <Link href="/topics" className="px-4">
              Topics
            </Link>
            <Link href="/subjects" className="px-4">
              Subjects
            </Link>
            {/* {localStorage.getItem("jwt") ? (
              <button
                onClick={() => {
                  localStorage.removeItem("jwt");
                  window.location.href = "/";
                }}
                className="px-4"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="px-4">
                  Login
                </Link>
                <Link href="/register" className="px-4">
                  Register
                </Link>
              </>
            )} */}
          </div>
        </div>
      </nav>
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
    </div>
  );
}
