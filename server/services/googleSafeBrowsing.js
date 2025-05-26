import axios from "axios";

const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

export async function checkGoogleSafeBrowsing(url) {
  try {
    const body = {
      client: {
        clientId: "phishing-url-detector",
        clientVersion: "1.0.0"
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }]
      }
    };

    const response = await axios.post(API_URL, body);
    return response.data && response.data.matches ? true : false;
  } catch (error) {
    console.error("Google Safe Browsing API error:", error.message);
    // Fail-safe: treat as not detected
    return false;
  }
}
