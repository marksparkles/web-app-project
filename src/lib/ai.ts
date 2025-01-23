import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function generateAISummary(jobSummary: string, steps: number): Promise<string> {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Summarize the following job summary in ${steps} steps:\n\n${jobSummary}`,
      max_tokens: 150 * steps,
      temperature: 0.7,
    })

    return response.data.choices[0].text?.trim() || "Failed to generate summary."
  } catch (error) {
    console.error("Error generating AI summary:", error)
    throw new Error("Failed to generate AI summary")
  }
}

