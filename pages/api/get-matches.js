import pool from "../../lib/db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const result = await pool.query("SELECT * FROM matches ORDER BY event_name, match_id");
        res.status(200).json({ matches: result.rows });
    } catch (error) {
        console.error("Error retrieving matches:", error);
        res.status(500).json({ error: "Failed to retrieve match data" });
    }
}
