import pool from "../../lib/db";
import axios from "axios";
import event_ids from "../../mockdata/event_ids";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        for (const event_id of event_ids) {
            console.log(`Updating results for event id: ${event_id}`);
            
            const eventUrl = `https://results.advancedeventsystems.com/api/event/${event_id}`;
            const eventResponse = await axios.get(eventUrl);
            const eventName = eventResponse.data?.Name || `Event_${event_id}`;
            const divisions = eventResponse.data?.Divisions || [];

            for (const division of divisions) {
                const divisionId = division.DivisionId;
                const standingsUrl = `https://results.advancedeventsystems.com/odata/${event_id}/standings(dId=${divisionId},cId=null,tIds=[])`;

                const standingsResponse = await axios.get(standingsUrl);
                const teams = standingsResponse.data?.value || [];

                for (const team of teams) {
                    const aesTeamId = team.TeamId;
                    const matchUrl = `https://results.advancedeventsystems.com/api/event/${event_id}/division/${divisionId}/team/${aesTeamId}/schedule/past`;

                    const matchResponse = await axios.get(matchUrl);
                    const matches = matchResponse.data || [];

                    for (const matchData of matches) {
                        const match = matchData.Match;
                        if (!match) continue;

                        const matchId = match.MatchId;
                        const firstTeam = match.FirstTeamName;
                        const secondTeam = match.SecondTeamName;
                        const winner = match.FirstTeamWon ? firstTeam : secondTeam;
                        const setScores = match.Sets.map(set => set.ScoreText).filter(Boolean).join(", ");

                        // Insert into PostgreSQL (Preventing Duplicates)
                        await pool.query(
                            `INSERT INTO matches (event_name, match_id, first_team, second_team, winner, set_scores)
                             VALUES ($1, $2, $3, $4, $5, $6)
                             ON CONFLICT (match_id, event_name) DO NOTHING`,
                            [eventName, matchId, firstTeam, secondTeam, winner, setScores]
                        );
                    }
                }
            }
        }

        res.status(200).json({ message: "Match results updated successfully!" });
    } catch (error) {
        console.error("Error fetching match data:", error);
        res.status(500).json({ error: "Failed to fetch match data" });
    }
}
