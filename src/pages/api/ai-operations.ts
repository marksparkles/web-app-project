import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"
import axios from "axios"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { operation, jobId, organisationId, text } = req.body

  try {
    // Fetch images from Supabase
    const { data: images, error: imageError } = await supabase
      .from("job_images")
      .select("image_data, type")
      .eq("job_id", jobId)

    if (imageError) throw new Error("Error fetching images")

    // Prepare content for AI processing
    const content = images!.map((img) => Buffer.from(img.image_data).toString("base64"))

    // Generate prompt
    const prompt = await getPrompt(operation, content, text)

    // Call OpenAI API
    const item = await handleOperation(prompt)

    if (!item || item === "error") {
      return res.status(500).json({ error: "Cannot identify item or generate summary" })
    }

    // Process and return results
    if (operation === "identify_asset") {
      const data = {
        name: item.name,
        category: item.category,
        asset_condition: item.condition,
        description: item.description,
        manufacturer: item.manufacturer,
        metadata: item.metadata,
        model: item.model,
      }
      return res.status(200).json({ data })
    } else if (operation === "job_summary") {
      const data = { summary: item }
      return res.status(200).json({ data })
    }
  } catch (error) {
    console.error("Error in AI operation:", error)
    return res.status(500).json({ error: (error as Error).message })
  }
}

async function getPrompt(operation: string, contents: string[], text = "") {
  if (operation === "identify_asset") {
    const messagesContent = [
      {
        type: "text",
        text: `Please identify the single item in the attached images.
Included as attachments are multiple images of the object from different angles.
Provide the details in this json format: {
"category": "<Car, Tool, Plant, etc>",
"name": "<A short description>",
"description": "<A long description containing as much detail as possible including the serial number if you can read it. >",
"condition": "Condition of the item, such as if there is any damage or wear and tear",
"manufacturer": "<manufacturer>",
"model": "<model>",
"metadata": ["<A list of health and safety metadata, e.g., 'carbonation process', 'pressurized gas cylinder'>"]} Health and safety metadata options include but are not limited to: • electrical • pressurized gas cylinder • carbonation process • lithium battery.
If you believe that there are missing safety metadata items, please add them. Note that the example metadata items which I have supplied are for example only so do not include them in your response if not relevant.
If you cannot identify please just respond with "error"`,
      },
    ]

    for (const content of contents) {
      messagesContent.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${content}`,
        },
      })
    }

    return {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: messagesContent,
        },
      ],
      max_tokens: 1000,
    }
  } else if (operation === "job_summary") {
    const messagesContent = [
      {
        type: "text",
        text: `Can you please summarise in one page the 10 likely steps required to complete the work depicted in these pictures and the description of the task being carried out which is: ${text}.
If you cannot identify the steps, please just respond with "error"`,
      },
    ]

    for (const content of contents) {
      messagesContent.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${content}`,
        },
      })
    }

    return {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: messagesContent,
        },
      ],
      max_tokens: 1000,
    }
  }
  throw new Error("Invalid operation")
}

async function handleOperation(prompt: any) {
  const url = "https://api.openai.com/v1/chat/completions"
  const openApiKey = process.env.OPENAI_API_KEY
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openApiKey}`,
  }

  try {
    const response = await axios.post(url, prompt, { headers })
    const choices = response.data.choices || []

    if (choices.length === 0) {
      throw new Error("No choices in response")
    }

    let message = choices[0].message.content || ""
    if (message.startsWith("```json") && message.endsWith("```")) {
      message = message.substring(7, message.length - 3).trim()
    }

    return JSON.parse(message)
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}

