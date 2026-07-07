import https from "https";
import dotenv from "dotenv";

dotenv.config();

function testEmailJS() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  console.log("Testing EmailJS with these values:");
  console.log("- Service ID:", serviceId);
  console.log("- Template ID:", templateId);
  console.log("- Public Key:", publicKey);
  console.log("- Private Key length:", privateKey ? privateKey.length : 0);

  const payload = JSON.stringify({
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: {
      candidate_name: "Test Candidate",
      candidate_email: "test@example.com",
      job_title: "Test Job",
      interview_date: "Today",
      interview_time: "Now",
      interview_location: "Zoom",
      interview_notes: "Test notes"
    }
  });

  const options = {
    hostname: "api.emailjs.com",
    port: 443,
    path: "/api/v1.0/email/send",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    let responseBody = "";
    console.log("Response Status:", res.statusCode);
    res.on("data", (chunk) => {
      responseBody += chunk;
    });
    res.on("end", () => {
      console.log("Response Body:", responseBody);
    });
  });

  req.on("error", (err) => {
    console.error("Request Error:", err);
  });

  req.write(payload);
  req.end();
}

testEmailJS();
