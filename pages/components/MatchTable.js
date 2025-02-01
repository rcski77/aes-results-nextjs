export default function MatchTable({ matches, selectedTeam }) {
    return (
        <div className="mt-6">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200 text-black">
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
                        <tr key={index} className="text-center">
                            <td className="border p-2">{match.eventName}</td>
                            <td className="border p-2">{match.matchId}</td>
                            <td className="border p-2">{match.firstTeam}</td>
                            <td className="border p-2">{match.secondTeam}</td>
                            <td
                                className={`border p-2 ${
                                    match.winner === selectedTeam
                                        ? "bg-green-300 text-black"
                                        : "bg-red-300 text-black"
                                }`}
                            >
                                {match.winner}
                            </td>
                            <td className="border p-2">{match.setScores}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
