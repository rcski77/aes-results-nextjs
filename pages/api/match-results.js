import axios from "axios";

export default async function handler(req, res) {
    const eventIds = [
        "PTAwMDAwMzg4Mzk90", // CO Challenge
        "PTAwMDAwMzY3NDY90", // Central Zone
        "PTAwMDAwMzY5MTI90",  // Nike Classic
        "PTAwMDAwMzcwNDg90", // OVR 18s Qualifier
        "PTAwMDAwMzcxNTM90", // Dallas 18s Qualifier
    ];

    let allMatches = [];

    try {
        for (const eventId of eventIds) {
            const eventUrl = `https://results.advancedeventsystems.com/api/event/${eventId}`;
            const eventResponse = await axios.get(eventUrl);
            const eventName = eventResponse.data?.Name || `Event_${eventId}`;
            const divisions = eventResponse.data?.Divisions || [];

            for (const division of divisions) {
                const divisionId = division.DivisionId;
                const standingsUrl = `https://results.advancedeventsystems.com/odata/${eventId}/standings(dId=${divisionId},cId=null,tIds=[])`;

                const standingsResponse = await axios.get(standingsUrl);
                const teams = standingsResponse.data?.value || [];

                for (const team of teams) {
                    const aesTeamId = team.TeamId;
                    const matchUrl = `https://results.advancedeventsystems.com/api/event/${eventId}/division/${divisionId}/team/${aesTeamId}/schedule/past`;

                    const matchResponse = await axios.get(matchUrl);
                    const matches = matchResponse.data || [];

                    matches.forEach(matchData => {
                        const match = matchData.Match;
                        if (!match) return;

                        allMatches.push({
                            eventName,
                            matchId: match.MatchId,
                            firstTeam: match.FirstTeamName,
                            secondTeam: match.SecondTeamName,
                            winner: match.FirstTeamWon ? match.FirstTeamName : match.SecondTeamName,
                            setScores: match.Sets.map(set => set.ScoreText).filter(Boolean).join(", "),
                        });
                    });
                }
            }
        }

         // ** Remove duplicates based on matchId & eventName **
         const uniqueMatches = Array.from(
            new Map(allMatches.map(match => [`${match.matchId}-${match.eventName}`, match])).values()
        )

        res.status(200).json({ matches: uniqueMatches });
    } catch (error) {
        console.error("Error fetching match data:", error);
        res.status(500).json({ error: "Failed to fetch match data" });
    }
}
