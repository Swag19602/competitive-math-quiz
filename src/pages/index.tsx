import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Function to handle redirection to /user
  const handleNext = () => {
    router.push('/user');
  };

  return (
    <div className="min-h-screen bg-black-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl text-center text-black">
        <h1 className="text-4xl font-bold mb-8">Math Quiz Rules & Regulations</h1>
        <div className="text-left mb-8">
          <ol className="list-decimal list-inside space-y-3 text-lg">
            <li>You must enter your name to participate in the quiz.</li>
            <li>Each question will be displayed until one user answers correctly.</li>
            <li>The first user to submit the correct answer will earn points.</li>
            <li>The quiz continues until all the 10 questions are answered or you press END.</li>
            <li>Your high score will be saved and displayed.</li>
            <li>If you answer incorrectly, you will get the correct answer and move on with the next question.</li>
            <li>Once a question is answered correctly, you can see the correct solution and press next to get the new queston.</li>
            <li>If you want to end the session, Press END button at the top right corner.</li>
          </ol>
        </div>
        <button
          className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};
