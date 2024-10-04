import { supabase } from "../pages/supabaseClient";

// Update the user's score if it's higher than the current score
const updateUserScore = async (user_name:string, newScore:number) => {
  // Fetch the user's current score
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("name", user_name)
    .single();

  if (userError) {
    throw new Error(`Error fetching user: ${userError.message}`);
  }

  // If the new score is higher, update it
  if (newScore > user.score) {
    const { error: scoreUpdateError } = await supabase
      .from("users")
      .update({ score: newScore })
      .eq("name", user_name);

    if (scoreUpdateError) {
      throw new Error(`Error updating score: ${scoreUpdateError.message}`);
    }
  }
};

module.exports = { updateUserScore };
