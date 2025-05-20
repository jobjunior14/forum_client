import Link from "next/link";
import { useState } from "react";
import AuthDialog from "../Dialog/authDialog";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggleAuthDialog, setToggleAuthDialog] = useState(false);

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
                Deconnexion
              </button>
            ) : (
              <>
                <button
                  onClick={() => setToggleAuthDialog(true)}
                  className="px-4"
                >
                  Connexion
                </button>
              </>
            )}
          </div>
        </div>

        <AuthDialog
          setToggleAuthDialog={setToggleAuthDialog}
          toggleAuthDialog={toggleAuthDialog}
        />
      </nav>
      {children}
    </div>
  );
}
