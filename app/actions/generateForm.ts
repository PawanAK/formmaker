"use server";

import { revalidatePath } from "next/cache";
import { json } from "stream/consumers";

import { z } from "zod";

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    description: z.string().min(1),
  });
  const parse = schema.safeParse({
    description: formData.get("description"),
  });

  if (!parse.success) {
    console.log(parse.success);
    return {
      message: "Invalid form data",
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      message: "API key not found",
    };
  }

  const data = parse.data;
  const promptExplanation =
    "Given the description, your task is to generate a survey object. This object should consist of three main fields: 'name' (string) for the form title, 'description' (string) for describing the form, and 'questions' (array) containing individual questions. Each question should have two properties: 'text' (string) representing the question itself, and 'fieldType' specifying the type of input field. The 'fieldType' can be one of the following options: 'RadioGroup', 'Select', 'Input', 'Textarea', or 'Switch'. For 'RadioGroup' and 'Select' types, additionally provide a 'fieldOptions' array containing objects with 'text' and 'value' properties. For example, for 'RadioGroup' and 'Select' types, the 'fieldOptions' array could be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}]. For 'Input', 'Textarea', and 'Switch' types, the 'fieldOptions' array should be empty. Return the survey object in JSON format.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${data.description} ${promptExplanation}`,
          },
        ],
      }),
    });

    revalidatePath("/");
    return {
      message: " successfully",
      data: json,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Error in API call",
    };
  }
}
