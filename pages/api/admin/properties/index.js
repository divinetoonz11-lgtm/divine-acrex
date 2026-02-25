import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const query = {};

    /* ================= SEARCH FILTER ================= */
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    /* ================= STATUS FILTER ================= */
    if (status) {
      query.status = status;
    }

    /* ================= TOTAL COUNT ================= */
    const totalCount = await db
      .collection("properties")
      .countDocuments(query);

    /* ================= PAGINATED DATA ================= */
    const properties = await db
      .collection("properties")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    const totalPages = Math.ceil(totalCount / limitNumber);

    return res.status(200).json({
      ok: true,
      properties,
      totalCount,
      totalPages,
      currentPage: pageNumber,
    });

  } catch (error) {
    console.error("ADMIN PROPERTIES API ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
