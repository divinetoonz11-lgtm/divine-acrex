// components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  MessageSquare,
  User,
  LogOut,
  ClipboardList,
} from "lucide-react";

/* ============= API HELPERS ============= */
async function fetchListingsApi() {
  try {
    const res = await fetch("/api/dashboard/listings");
    const d = await res.json();
    return d.listings || [];
  } catch {
    return [];
  }
}

async function fetchProfileApi() {
  try {
    const res = await fetch("/api/dashboard/profile");
    return await res.json();
  } catch {
    return { name: "", email: "", phone: "" };
  }
}

async function savePhoneApi(phone) {
  await fetch("/api/dashboard/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
}

/* ============= MAIN COMPONENT ============= */
export default function UserDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("listings");
  const [listings, setListings] = useState([]);
  const [profile, setProfile] = useState({});
  const [phonePopup, setPhonePopup] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const dummyImgs = [
    "/images/listing-example-1.png",
    "/images/listing-example-2.png",
    "/images/listing-example-3.png",
    "/images/listing-example-4.png",
    "/images/listing-example-5.png",
    "/images/listing-example-6.png",
  ];

  /* ============= LOAD DATA ============= */
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("da_user_token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("da_user_role") : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role && role !== "user") {
      router.replace(role === "dealer" ? "/dashboard/dealer" : "/dashboard/admin");
      return;
    }

    (async () => {
      const pro = await fetchProfileApi();
      setProfile(pro);

      if (!pro.phone || pro.phone.trim() === "") {
        setPhonePopup(true);
      }

      const lst = await fetchListingsApi();
      setListings(
        lst.length === 0
          ? dummyImgs.map((src, i) => ({
              id: `d-${i}`,
              img: src,
              title: `Dummy Property ${i + 1}`,
              city: "Malad West",
              price: i % 2 === 0 ? "₹85 Lacs" : "₹25,000 / month",
            }))
          : lst
      );
    })();
  }, []);

  /* ============= LOGOUT ============= */
  function logoutUser() {
    localStorage.removeItem("da_user_token");
    localStorage.removeItem("da_user_role");
    router.replace("/");
  }

  /* ============= UI LAYOUT ============= */
  return (
    <div className="min-h-screen bg-[#eef3f8] text-gray-800 flex">

      {/* ========== SIDEBAR ========== */}
      <aside className="w-[220px] bg-white border-r border-gray-200 fixed left-0 top-0 h-full shadow-sm z-20">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <img src="/images/A_digital_graphic_design_features_a_logo_consistin.png" className="w-36" />
        </div>

        <nav className="mt-4 flex flex-col">
          <SidebarItem id="listings" label="My Listings" Icon={ClipboardList} active={active} setActive={setActive} />
          <SidebarItem id="leads" label="Leads / Enquiries" Icon={MessageSquare} active={active} setActive={setActive} />
          <SidebarItem id="messages" label="Messages" Icon={MessageSquare} active={active} setActive={setActive} />
          <SidebarItem id="profile" label="Profile" Icon={User} active={active} setActive={setActive} />
        </nav>

        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={logoutUser}
            className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 text-gray-700"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN AREA ========== */}
      <main className="ml-[220px] flex-1 p-6 overflow-hidden">
        <div className="bg-white p-4 rounded shadow-sm mb-4 flex items-center justify-between border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1d3c70]">User Dashboard</h2>
          <input
            placeholder="Search listings..."
            className="border px-3 py-2 rounded w-56 text-sm"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4 h-[calc(100vh-160px)] overflow-auto">
          {active === "listings" && <ListingsGrid listings={listings} />}
          {active === "leads" && <Placeholder label="No Leads Yet" />}
          {active === "messages" && <Placeholder label="No Messages Yet" />}
          {active === "profile" && <ProfileSection data={profile} logoutUser={logoutUser} />}
        </div>
      </main>

      {/* ========== PHONE POPUP ========== */}
      {phonePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-lg w-[340px] shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
            <p className="text-sm text-gray-500 mb-3">Mobile number required to continue.</p>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="border rounded w-full px-3 py-2 mb-3"
            />

            <button
              onClick={async () => {
                if (phoneInput.length < 10) return alert("Enter valid mobile number");
                await savePhoneApi(phoneInput);
                setPhonePopup(false);
                setProfile({ ...profile, phone: phoneInput });
              }}
              className="bg-[#1d3c70] text-white px-4 py-2 rounded w-full"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============= SIDEBAR ITEM ============= */
function SidebarItem({ id, active, label, Icon, setActive }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => setActive(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
        isActive
          ? "bg-[#e8eef9] text-[#1d3c70] font-semibold border-l-4 border-[#1d3c70]"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

/* ============= LISTINGS GRID ============= */
function ListingsGrid({ listings }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Your Listings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((item) => (
          <div key={item.id} className="flex gap-3 border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition">
            <div className="w-36 h-24 rounded overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={item.img}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/listing-example-6.png";
                }}
              />
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-[15px] leading-tight">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.city}</p>
              <p className="text-green-600 font-semibold mt-1">{item.price}</p>

              <div className="flex gap-2 mt-2 text-xs">
                <button className="px-2 py-1 border rounded">Edit</button>
                <button className="px-2 py-1 border rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============= PROFILE SECTION ============= */
function ProfileSection({ data, logoutUser }) {
  return (
    <div>
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-white text-3xl">
          {data.name ? data.name.charAt(0).toUpperCase() : "U"}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">{data.name || "-"}</h3>
          <p><strong>Email:</strong> {data.email || "-"}</p>
          <p className="mt-2"><strong>Phone:</strong> {data.phone || "-"}</p>

          <button onClick={logoutUser} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============= PLACEHOLDER ============= */
function Placeholder({ label }) {
  return <div className="text-center text-gray-500 py-20 text-lg">{label}</div>;
}
