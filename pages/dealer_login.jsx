import { signIn, useSession } from "next-auth/react";

export default function DealerLogin() {
  const { status } = useSession();

  if (status === "loading") return null;

  const dealerGoogleLogin = () => {
    // 🔑 DEALER INTENT SAVE (MISSING PIECE)
    localStorage.setItem("dealer_intent", "1");

    signIn("google", {
      callbackUrl: "/auth/redirect",
    });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:360, background:"#fff", padding:30, borderRadius:14 }}>
        <h2>Dealer Login</h2>

        <button onClick={dealerGoogleLogin}>
          Continue with Google
        </button>

        <div style={{ marginTop:16 }}>
          <a href="/">Back to Home</a>
        </div>
      </div>
    </div>
  );
}
