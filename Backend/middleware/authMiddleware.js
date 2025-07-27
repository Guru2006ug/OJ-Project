const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log('\n=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('Request headers authorization:', req.headers.authorization);
  console.log('Request cookies:', req.cookies);
  
  let token;

  // Try to get token from Authorization header first (for API calls)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    console.log('Token found in Authorization header');
  }
  // Fall back to cookie if no Authorization header
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token found in cookies');
  }

  if (!token) {
    console.log("No token found in request");
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Token decoded successfully:");
    console.log('- User ID:', decoded.id);
    console.log('- Email:', decoded.email);
    console.log('- Full decoded object:', decoded);
    
    req.user = decoded;
    console.log('req.user set to:', req.user);
    console.log('=== AUTH MIDDLEWARE DEBUG END ===\n');
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    console.log('=== AUTH MIDDLEWARE DEBUG END (ERROR) ===\n');
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};

module.exports = authMiddleware;