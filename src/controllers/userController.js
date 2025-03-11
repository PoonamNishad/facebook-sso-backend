const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.getProfile = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.getUserPages = async (req, res) => {
  const userAccessToken = req.headers.authorization?.split(" ")[1];

  if (!userAccessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const response = await axios.get(
      "https://graph.facebook.com/v22.0/me/accounts?type=page&",
      {
        params: { access_token: userAccessToken },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pages", error: error });
  }
};

exports.getPageInsights = async (req, res) => {
  const userAccessToken = req.headers.authorization?.split(" ")[1];

  const { pageId } = req.query;

  if (!pageId || !userAccessToken || pageId == "null") {
    console.log(pageId, "pageId");
    return res
      .status(400)
      .json({ error: "Page ID and Access Token are required" });
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${pageId}/insights`,
      {
        params: {
          metric:
            "page_fan_count,page_engaged_users,page_impressions,page_actions_post_reactions_total",
          access_token: userAccessToken,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch page insights" });
  }
};
