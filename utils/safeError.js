// utils/safeError.js
export function safeError(error, message = "Something went wrong") {
  // Never expose internal server error details
  console.error("SERVER ERROR:", error);

  return {
    success: false,
    error: message, // clean error for frontend
  };
}

// helper for try/catch wrapper
export async function tryCatch(res, fn) {
  try {
    await fn();
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
