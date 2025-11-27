import React from "react";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdPhone } from "react-icons/md";

export default function LoginButtons({
  onGoogle = () => {},
  onEmail = () => {},
  onPhone = () => {},
}) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex flex-col gap-3">
        <button
          onClick={onGoogle}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-lg border hover:shadow-md transition-shadow bg-white"
        >
          <span className="text-2xl"><FcGoogle /></span>
          <span className="font-medium">Continue with Google</span>
        </button>

        <button
          onClick={onEmail}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-lg border hover:shadow-md bg-white"
        >
          <span className="text-2xl"><MdEmail /></span>
          <span className="font-medium">Sign in with Email</span>
        </button>

        <button
          onClick={onPhone}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-lg border hover:shadow-md bg-white"
        >
          <span className="text-2xl"><MdPhone /></span>
          <span className="font-medium">Sign in with Phone</span>
        </button>
      </div>

      <p className="text-xs text-center text-gray-500">
        By continuing you agree to our Terms & Privacy.
      </p>
    </div>
  );
}
