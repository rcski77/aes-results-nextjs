import { useEffect, useState } from "react";
import MatchTable from "./components/MatchTable";

export default function Home() {
    const [matches, setMatches] = useState([]);  
    const [selectedTeam, setSelectedTeam] = useState("All Teams");
    const [loading, setLoading] = useState(false);
    const [allTeams, setAllTeams] = useState([]);  // ✅ Track all teams separately

    // ✅ Fetch stored matches from PostgreSQL on page load
    const fetchStoredMatches = async () => {
        try {
            const response = await fetch("/api/get-matches");
            const data = await response.json();
            if (data.matches && Array.isArray(data.matches)) {
                setMatches(data.matches);
            } else {
                console.warn("⚠️ Invalid matches data received:", data);
                setMatches([]);
            }
        } catch (error) {
            console.error("❌ Error fetching stored matches:", error);
            setMatches([]);
        }
    };

    // ✅ Fetch matches when page loads
    useEffect(() => {
        fetchStoredMatches();
    }, []);

    // ✅ Fetch new matches and store them in PostgreSQL
    const fetchAndStoreMatches = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/fetch-and-store", { method: "POST" });
            const data = await response.json();
            alert(data.message || "Matches updated!");
            fetchStoredMatches();  // ✅ Refresh matches after storing new ones
        } catch (error) {
            console.error("❌ Error fetching new matches:", error);
            alert("Failed to fetch new matches.");
        }
        setLoading(false);
    };

    // ✅ Update `allTeams` whenever `matches` changes
    useEffect(() => {
        if (matches.length > 0) {
            const teams = [...new Set(
                matches.flatMap(m => [m.first_team?.trim(), m.second_team?.trim()])
                .filter(Boolean)  // ✅ Remove empty values
            )].sort((a, b) => a.localeCompare(b));
            setAllTeams(teams);
            console.log("✅ Updated Team List:", teams);  // Debugging
        }
    }, [matches]);  // ✅ Runs whenever `matches` updates

    // ✅ Filter matches based on selected team
    const filteredMatches = selectedTeam === "All Teams"
        ? matches
        : matches.filter(m => m.first_team === selectedTeam || m.second_team === selectedTeam);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center">🏐 Volleyball Match Results</h1>

            {/* ✅ Button to Fetch & Store New Matches */}
            <div className="flex justify-center my-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={fetchAndStoreMatches}
                    disabled={loading}
                >
                    {loading ? "Updating Matches..." : "Fetch New Matches"}
                </button>
            </div>

            {/* ✅ Team Selection Dropdown */}
            <div className="mt-4">
                <label className="block text-lg font-medium">Filter by Team:</label>
                <select
                    className="bg-white text-black border border-gray-300 p-2 rounded w-full"
                    value={selectedTeam}
                    onChange={e => setSelectedTeam(e.target.value)}
                >
                    <option>All Teams</option>
                    {allTeams.map(team => (
                        <option key={team}>{team}</option>
                    ))}
                </select>
            </div>

            {/* ✅ Match Table */}
            <MatchTable matches={filteredMatches} selectedTeam={selectedTeam} />
        </div>
    );
}
