export default function MatchTable({ matches, selectedTeam }) {
    if (!matches || matches.length === 0) {
        return <p className="text-center text-gray-500 mt-4">No matches found.</p>;
    }

    return (
        <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-black">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Event</th>
                        <th className="border p-2">Match ID</th>
                        <th className="border p-2">First Team</th>
                        <th className="border p-2">Second Team</th>
                        <th className="border p-2">Winner</th>
                        <th className="border p-2">Set Scores</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match, index) => (
                        <tr key={index} className="text-center text-white">
                            <td className="border p-2">{match.event_name || "N/A"}</td>
                            <td className="border p-2">{match.match_id || "N/A"}</td>
                            <td className="border p-2">{match.first_team || "N/A"}</td>
                            <td className="border p-2">{match.second_team || "N/A"}</td>
                            <td
                                className={`border p-2 font-bold ${
                                    selectedTeam !== "All Teams"
                                        ? match.winner === selectedTeam
                                            ? "bg-green-300 text-black"  // ✅ Green if selected team won
                                            : "bg-red-300 text-black"    // ❌ Red if selected team lost
                                        : ""
                                }`}
                            >
                                {match.winner || "N/A"}
                            </td>
                            <td className="border p-2">{match.set_scores || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
