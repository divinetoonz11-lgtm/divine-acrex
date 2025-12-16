export default function handler(req, res) {
  return res.status(200).json({
    success: false,
    message: "Filters module temporarily disabled",
  });
}
