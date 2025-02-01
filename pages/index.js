import { useEffect, useState } from "react";
import MatchTable from "./components/MatchTable";


export default function Home() {
    const [matches, setMatches] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("All Teams");

    useEffect(() => {
        fetch("/api/match-results")
            .then(res => res.json())
            .then(data => setMatches(data.matches))
            .catch(error => console.error("Error fetching matches:", error));
    }, []);

    // Get unique team names for filtering (sorted alphabetically)
    const allTeams = [...new Set(matches.flatMap(m => [m.firstTeam, m.secondTeam]))]
        .sort((a, b) => a.localeCompare(b));

    // Filtered matches based on selected team
    const filteredMatches = selectedTeam === "All Teams"
        ? matches
        : matches.filter(m => m.firstTeam === selectedTeam || m.secondTeam === selectedTeam);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center">🏐 Volleyball Match Results</h1>

            {/* Team Selection Dropdown */}
            <div className="mt-4">
                <label className="block text-lg font-medium">Filter by Team:</label>
                <select
                    className="block bg-white text-black border border-gray-300 p-2 rounded"
                    value={selectedTeam}
                    onChange={e => setSelectedTeam(e.target.value)}
                >
                    <option>All Teams</option>
                    {allTeams.map(team => (
                        <option key={team}>{team}</option>
                    ))}
                </select>
            </div>

            {/* Match Table */}
            <MatchTable matches={filteredMatches} selectedTeam={selectedTeam} />
        </div>
    );
}
