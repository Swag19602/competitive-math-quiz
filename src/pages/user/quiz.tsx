import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient'; // Import the Supabase client
import { useRouter } from 'next/router';
import { getOrCreateQuestion, markQuestionInactive } from '@/utils/questionHandler';
import { checkAnswer, fetchCorrectAnswer } from '@/utils/gemini';

interface Question {
    id: number;
    question: string;
    correct_answer?: string;
    solved_by?: string | null;
}

const QuizPage = () => {
    const [userName, setUserName] = useState<string>('');
    const [question, setQuestion] = useState<Question | null>(null);
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        const storedScore = localStorage.getItem('userScore')
        if (storedUserName) {
            setUserName(storedUserName);
            setScore(storedScore ? parseInt(storedScore) : 0); // Initialize sco
            fetchUserScore(storedUserName);
        }

        // Fetch the first question
        fetchQuestion();
    }, []);

    // Fetch user's current score and highest score from Supabase
    const fetchUserScore = async (userName: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('highest_score')
            .eq('name', userName)
            .single();

        if (data) {
            setHighestScore(data.highest_score); // Initially, the highest score is the current score
        } else if (error) {
            console.error("Error fetching user score:", error);
        }
    };

    // Fetch or create a new question using the question handler
    const fetchQuestion = async () => {
        try {
            await getOrCreateQuestion();
            await new Promise((resolve) => setTimeout(resolve, 500));
            const { data, error } = await supabase
                .from("questions")
                .select("*")
                .eq("active", true)
            if (error) {
                console.error("Error fetching question:", error.message);
            }
            console.log("Fetched Question:", data); // Check if data is being fetched correctly
            if (data) {
                setQuestion(data[0]);
                setAnswer('');  // Reset the answer field when a new question is loaded
                setFeedback(null);  // Clear feedback
            } else {
                console.log("No question data returned.");
            }
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    };

    // Handle form submission and answer checking
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;
        const { data: activeQuestion } = await supabase
            .from("questions")
            .select("*")
            .eq("question", question.question)
            .single()
       

        setLoading(true);
        const check = await checkAnswer(answer, question.question)
        console.log(check ,'check')
        const correct_answer = await fetchCorrectAnswer(question.question)
        if (correct_answer) {
            question.correct_answer = correct_answer
        }
        // Check if the answer is correct
        
        if (check) {
            if (!activeQuestion.active) {
                setFeedback(`OOps! 🤭  Correct! But Already Solved by ${activeQuestion.solved_by}. Try next one.`)
                return
            }
            setFeedback(`Correct! The solution is ${question.correct_answer}`);
            markQuestionInactive(question.question,userName)
            await updateUserScore();  // Update the user score if the answer is correct
        } else {
            if (!activeQuestion.active) {
                setFeedback(`OOps! 🤭  Wrong Answer! Already Solved by ${activeQuestion.solved_by}. The correct answer is ${question.correct_answer}. Try Next one`)
                setQuestion(question)
                return 
            }
            setQuestion(question)
            setFeedback(`Wrong answer. The correct answer is ${question.correct_answer}`);
        }

        setLoading(false);
    };

    // Update the user's score and compare with the highest score in Supabase
    const updateUserScore = async () => {
        if (!userName) return;

        const newScore = score + 1;
        setScore(newScore); // Update local score state
        localStorage.setItem('userScore', newScore.toString()); // Persist score in localStorage
        // If the new score is higher than the current highest score, update it
        if (newScore > highestScore) {
            setHighestScore(newScore)
            const { data, error } = await supabase
                .from('users')
                .update({ highest_score: newScore })
                .eq('name', userName);

            if (data) {
                setScore(newScore); // Update local score state
                setHighestScore(newScore); // Update highest score state
            } else if (error) {
                console.error("Error updating user score:", error);
            }
        } else {
            // Just update the score in state if it's not higher than the highest score
            setScore(newScore);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-20 rounded-lg shadow-lg max-w-fit text-center relative">

                {/* Highest Score Display */}
                <div className="absolute top-4 left-5 bg-gray-700 px-2 py-2 rounded-lg shadow-md text-white">
                    <p className="font-semibold">{userName || "Unknown User"}</p>
                    <p>{`Highest Score - ${highestScore}`}</p>
                </div>

                {/* End Quiz Button */}
                <div className="absolute top-5 right-5">
                    <button
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                        onClick={() => router.push('/user/dashboard')}
                    >
                        END
                    </button>
                </div>

                {/* Quiz Title */}
                <h2 className="text-4xl font-bold text-white mb-8">Maths Quiz</h2>

                {question ? (
                    <>
                        {/* Question Display */}
                        {/* Question Display */}
                        <div className="bg-gray-900 p-2 rounded-lg border border-blue-500 mb-6">
                            <p className="text-2xl text-blue-400 font-bold mb-2">Question:</p>
                            <p className="text-xl text-white">{question.question}</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Answer Input */}
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Answer—text box"
                                className="border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-4 w-full mb-4 focus:outline-none focus:border-blue-500"
                            />

                            {/* Feedback (Correct/Incorrect Answer) */}
                            {feedback && (
                                <div className={`p-4 rounded-lg border ${feedback.includes('Correct!')
                                        ? 'bg-green-800 border-green-500'
                                        : 'bg-red-800 border-red-500'
                                    } mb-6`}
                                >
                                    <p
                                        className={`${feedback.includes('Correct!')
                                                ? 'text-white-400'
                                                : 'text-white-400'
                                            } text-lg font-semibold`}
                                    >
                                        {feedback}
                                    </p>
                                </div>
                            )}
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`text-white px-6 py-2 rounded-lg transition ${loading || feedback !== null
                                        ? 'bg-gray-400 cursor-not-allowed' // Gray and disabled styles
                                        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer' // Active styles
                                    }`}
                                disabled={loading || feedback !==null }
                                // disabled={loading }
                            >
                                {loading ? 'Checking...' : 'Submit'}
                            </button>
                        </form>

                        {/* Next Button */}
                        {feedback && (
                            <button
                                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                onClick={() => fetchQuestion()}
                            >
                                Next
                            </button>
                        )}
                    </>
                ) : (
                    <p className="text-white">Loading question...</p>
                )}
            </div>
        </div>
    );
};

export default QuizPage;