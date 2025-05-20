import Link from "next/link";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            {localStorage.getItem("jwt") ? (
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
            )}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
