import {supabase} from './supabaseClient'
import { generateMathQuestion } from './gemini';
// import fetchFromGemini from './gemini'

// Fetch the active question or generate a new one
export const getOrCreateQuestion = async () => {
  // Step 1: Check if there is an active question
  const { data: activeQuestion, error } = await supabase
    .from("questions")
    .select("*")
    .eq("active", true)
    if (error) {
      console.error("Error fetching question:", error.message);
    }
    console.log(activeQuestion, 'active ')
  if (activeQuestion && activeQuestion?.length > 0) {
    return activeQuestion[0]; // Return the active question if it exists
  }

  // Step 2: Generate a new question from Gemini
  let newQuestion;
  let isDuplicate = true;

  // Step 3: Keep generating new questions until a unique one is found
  while (isDuplicate) {
    newQuestion = await generateMathQuestion();

    // Step 4: Check if the new question already exists in the database
    const { data: existingQuestion } = await supabase
      .from("questions")
      .select("*")
      .eq("question", newQuestion)
      .single();

    // If no duplicate is found, set isDuplicate to false
    if (!existingQuestion) {
      isDuplicate = false;
    }
  }
  console.log(newQuestion, 'new question')
  // Step 5: Insert the new unique question into Supabase and mark it as active
  const { data, error: insertError } = await supabase
    .from("questions")
    .insert({ question: newQuestion, active: true })
    .single();

  if (insertError) {
    throw new Error(`Error creating new question: ${insertError.message}`);
  }
  if(data){
    console.info('question generated inserted')
  }
  return newQuestion;
};

// Mark the current question as inactive
export const markQuestionInactive = async (question:string, user_name: string) => {

  const { error } = await supabase
    .from("questions")
    .update({ active: false, solved_by: user_name})
    .eq("question", question);

  if (error) {
    throw new Error(`Error marking question inactive: ${error.message}`);
  }
};


