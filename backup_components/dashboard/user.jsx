import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // SSR safety
    if (typeof window === "undefined") return;

    const logged = localStorage.getItem("logged_in");
    const role = localStorage.getItem("role");

    // protect route
    if (logged !== "yes" || role !== "user") {
      router.push("/login/user");
      return;
    }

    // safe browser-side reading
    setEmail(localStorage.getItem("user_email") || "");
    setPhone(localStorage.getItem("user_phone") || "");
    setAvatar(localStorage.getItem("user_avatar") || "");
    setName(localStorage.getItem("user_name") || "");
  }, []);

  function logoutUser() {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.dispatchEvent(new Event("authChanged"));
    }
    router.push("/login/user");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>User Dashboard</h1>

      {avatar ? (
        <img
          src={avatar}
          alt="avatar"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 20
          }}
        />
      ) : null}

      <p><b>Name:</b> {name}</p>
      <p><b>Email:</b> {email}</p>
      <p><b>Phone:</b> {phone}</p>

      <button
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}
        onClick={logoutUser}
      >
        Logout
      </button>
    </div>
  );
}
