import { useState } from 'react';
import { useRouter } from 'next/router';
import {supabase} from '../../utils/supabaseClient'

const UserPage = () => {
    const [name, setName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') {
            alert('Please enter your name.');
            return;
        }

        // Check if the user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('name', name)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking user: ' + fetchError.message);
            return;
        }

        if (existingUser) {
            // User already exists, proceed and store the user ID or name in localStorage
            localStorage.setItem('userName', existingUser.name);
            localStorage.setItem('userScore', '0');
            router.push('/user/quiz'); // Redirect to the quiz page
        } else {
            // Insert the new user into the Supabase 'users' table
            const { data, error: insertError } = await supabase
                .from('users')
                .insert([{ name }])
                .single();

            if (insertError) {
                console.error('Error saving user: ' + insertError.message);
                return;
            }else if(data){
                console.log('entered succesfully')
            }

            // Store the newly created user ID and redirect to the quiz page
            localStorage.setItem('userName', name);
            localStorage.setItem('userScore', '0');
            router.push('/user/quiz'); // Redirect to the quiz page
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                <h1 className="text-3xl font-bold text-white mb-6">Enter User Name</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:border-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserPage;