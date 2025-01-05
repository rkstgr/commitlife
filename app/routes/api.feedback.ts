// app/routes/api.feedback.tsx
import { ActionFunctionArgs } from "@remix-run/node";
import { Resend } from "resend";
import { json } from "@vercel/remix";

const resend = new Resend(process.env.RESEND_API_KEY);
const FEEDBACK_EMAIL = "rkstgr@gmail.com";

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const sentiment = formData.get("sentiment");
  const feedback = formData.get("feedback");

  if (!feedback) {
    return Response.json({
      errors: { feedback: "Please provide feedback" },
    });
  }

  try {
    await resend.emails.send({
      from: "commitlife <onboarding@resend.dev>",
      to: FEEDBACK_EMAIL,
      subject: sentiment
        ? `New Feedback: ${getSentimentEmoji(sentiment.toString())}`
        : "New Feedback",
      text: `${
        sentiment ? `Sentiment: ${sentiment}\n\n` : ""
      }Feedback:\n${feedback}`,
      html: `
        <h2>New Feedback Received</h2>
        ${
          sentiment
            ? `<p><strong>Sentiment:</strong> ${sentiment} ${getSentimentEmoji(
                sentiment.toString()
              )}</p>`
            : ""
        }
        <p><strong>Feedback:</strong></p>
        <p>${feedback}</p>
      `,
    });

    return json({ success: true });
  } catch (error) {
    return json(
      { errors: { _form: "Failed to send feedback. Please try again." } },
      { status: 500 }
    );
  }
}

function getSentimentEmoji(sentiment: string): string {
  switch (sentiment) {
    case "negative":
      return "👎";
    case "neutral":
      return "🤷‍♂️";
    case "positive":
      return "❤️";
    default:
      return "";
  }
}
