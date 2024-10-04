import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    highest_score: number;
}

const DashboardPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    useEffect(() => {
        // Fetch users from the Supabase database
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('users') // Type the query to expect an array of 'User'
                .select('id, name, highest_score')
                .order('highest_score', { ascending: false });
            console.log('data', data)
            if (error) {
                console.error('Error fetching users:', error);
            } else {
                setUsers(data || []); // Set users data or empty array if no data
            }
            setLoading(false);
        };

        fetchUsers();
    }, []);
    const handlePlayAgain=(()=>{
        localStorage.setItem('userScore', '0');
        router.push('/user/quiz')
    })

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full text-center">
                <h2 className="text-4xl font-bold text-white mb-6">Dashboard</h2>
                {/* Go to User Page Button */}
               
                <div className="absolute top-5 left-200">
                    <button
                        className="bg-blue-300-900-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => router.push('/')}
                    >
                        🏠  Home
                    </button>
                    </div>
                <div className="absolute top-5 left-5">
                    <button
                        className="bg-blue-300-900-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => handlePlayAgain()}
                    >
                        🔁  Play Again
                    </button>
                    </div>
                <div className="absolute top-5 right-5">
                    <button
                        className="bg-blue-300-900-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => router.push('/user')}
                    >
                        🚹 User Page
                    </button>
                    </div>

                {loading ? (
                    <p className="text-white">Loading...</p>
                ) : (
                    <table className="w-full text-left text-white border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-4 py-2 text-lg">Rank</th>
                                <th className="px-4 py-2 text-lg">Name</th>
                                <th className="px-4 py-2 text-lg">Highest Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.id} className="border-b border-gray-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{user.name}</td>
                                        <td className="px-4 py-2">{user.highest_score}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;