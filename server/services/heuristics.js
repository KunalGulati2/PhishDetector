import { checkGoogleSafeBrowsing } from "./googleSafeBrowsing.js";

// Add protocol if missing
function normalizeUrl(url) {
  const hasProtocol = /^https?:\/\//i.test(url.trim());
  return hasProtocol ? url.trim() : `https://${url.trim()}`;
}

// Check for known legitimate domains
function isKnownSafeDomain(domain) {
  const safeDomains = [
    'youtube.com', 'google.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'github.com', 'stackoverflow.com', 'wikipedia.org', 'amazon.com',
    'microsoft.com', 'apple.com', 'netflix.com', 'reddit.com', 'twitch.tv',
    'gmail.com', 'outlook.com', 'yahoo.com', 'bing.com', 'discord.com'
  ];
  
  // Only exact matches or direct subdomains of these safe domains
  for (const safeDomain of safeDomains) {
    if (domain === safeDomain || domain.endsWith('.' + safeDomain)) {
      return true;
    }
  }
  return false;
}

// Check for financial institution impersonation
function isFinancialImpersonation(domain, path) {
  const financialBrands = [
    'paypal', 'chase', 'bankofamerica', 'wellsfargo', 'citibank', 'jpmorgan',
    'americanexpress', 'visa', 'mastercard', 'discover', 'capitalone',
    'usbank', 'pnc', 'td', 'hsbc', 'barclays', 'santander', 'ally',
    'schwab', 'fidelity', 'vanguard', 'etrade', 'robinhood'
  ];
  
  const fullUrl = domain + path;
  
  for (const brand of financialBrands) {
    // Check if brand appears in domain but domain is not the official domain
    if (domain.includes(brand) && !domain.endsWith(brand + '.com') && !domain.endsWith(brand + '.co.uk')) {
      return true;
    }
    // Check if brand appears in path (like paypal.co.uk in path)
    if (path.toLowerCase().includes(brand)) {
      return true;
    }
  }
  return false;
}

// Check for tech company impersonation  
function isTechImpersonation(domain, path) {
  const techBrands = [
    'microsoft', 'apple', 'google', 'amazon', 'facebook', 'meta',
    'netflix', 'spotify', 'adobe', 'dropbox', 'zoom', 'slack'
  ];
  
  const fullUrl = domain + path;
  
  for (const brand of techBrands) {
    if (domain.includes(brand) && !isKnownSafeDomain(domain)) {
      return true;
    }
    if (path.toLowerCase().includes(brand)) {
      return true;
    }
  }
  return false;
}

// Check for suspicious domain patterns
function hasSuspiciousDomain(domain) {
  const labels = domain.split(".");
  
  // Basic malformed domain checks
  for (const label of labels) {
    if (label.length === 0) return true;
    if (label.endsWith(".")) return true;
    if (!/^[a-z0-9-]+$/i.test(label)) return true;
    if (/--/.test(label) || label.startsWith("-") || label.endsWith("-")) return true;
  }
  
  // Suspicious patterns
  if (/\d{4,}/.test(domain)) return true; // Long number sequences
  if (domain.includes("anonyme") || domain.includes("identity")) return true;
  if (domain.split('.').some(part => part.length > 25)) return true; // Very long parts
  
  // Random/gibberish domain detection
  const mainDomain = domain.split('.')[0];
  if (mainDomain.length > 8) {
    // Check for lack of vowels (common in random domains)
    const vowelCount = (mainDomain.match(/[aeiou]/gi) || []).length;
    const consonantCount = mainDomain.length - vowelCount;
    if (vowelCount === 0 || consonantCount / vowelCount > 4) return true;
    
    // Check for random character patterns
    if (/^[a-z]{8,}$/i.test(mainDomain) && !/ing$|tion$|ed$|er$|ly$/.test(mainDomain)) {
      // Likely random if no common English endings
      return true;
    }
  }
  
  return false;
}

// Check for suspicious path patterns
function hasSuspiciousPath(path) {
  const segments = path.split("/");
  
  // Basic suspicious patterns
  for (const segment of segments) {
    if (segment.endsWith(".")) return true;
    if (segment.includes("..")) return true;
  }
  
  if (/\.\.+/.test(path)) return true;
  if (path.includes("/./")) return true;
  if (/\.(exe|zip|rar|bat|scr|com|pif)$/i.test(path)) return true;
  
  // Suspicious script/file patterns
  if (/cycgi-bin|webscr|cmd=|nav=/.test(path)) return true; // PayPal phishing patterns
  if (/loading\.php|verify\.php|update\.php|secure\.php/.test(path)) return true;
  if (/plugins\/[a-z]+\/$/.test(path)) return true; // WordPress plugin paths used for phishing
  
  // Long random parameters
  if (/[?&][a-z]{20,}=/.test(path)) return true;
  
  return false;
}

// Check for suspicious TLD combinations
function hasSuspiciousTLD(domain) {
  const suspiciousTLDs = [
    '.tk', '.ml', '.ga', '.cf', '.click', '.download', '.work', '.top',
    '.online', '.site', '.website', '.space', '.win', '.bid'
  ];
  return suspiciousTLDs.some(tld => domain.endsWith(tld));
}

// Heuristic scoring: lower score = more risky
export function heuristicScore(rawUrl) {
  let score = 70; // Start with higher neutral score
  let domain, pathname;

  const url = normalizeUrl(rawUrl);

  try {
    const parsedUrl = new URL(url);
    domain = parsedUrl.hostname.toLowerCase();
    pathname = parsedUrl.pathname + parsedUrl.search;
  } catch {
    return 0; // Invalid URLs are highly suspicious
  }

  // Known safe domains get boost
  if (isKnownSafeDomain(domain)) {
    score += 30;
  }
  
  // Check if domain looks legitimate (common TLDs, reasonable structure)
  const legitimateTLDs = ['.com', '.org', '.net', '.edu', '.gov', '.co.uk', '.io', '.dev'];
  const hasLegitTLD = legitimateTLDs.some(tld => domain.endsWith(tld));
  
  if (hasLegitTLD && !isKnownSafeDomain(domain)) {
    score += 10; // Boost for legitimate TLDs
  } else if (!hasLegitTLD && !isKnownSafeDomain(domain)) {
    score -= 15; // Penalty for suspicious TLDs only
  }

  // MAJOR red flags - immediate high suspicion
  if (isFinancialImpersonation(domain, pathname)) score -= 60;
  if (isTechImpersonation(domain, pathname)) score -= 50;
  
  // IP address instead of domain
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) score -= 70;
  
  // @ symbol in URL (credential harvesting)
  if (url.includes("@")) score -= 50;
  
  // Suspicious domain patterns
  if (hasSuspiciousDomain(domain)) score -= 40;
  
  // Suspicious path patterns  
  if (hasSuspiciousPath(pathname)) score -= 40;
  
  // HTTPS gets a small boost
  if (url.startsWith("https://")) score += 5;
  
  // HTTP gets penalty only if other suspicious elements present
  if (url.startsWith("http://")) score -= 15;
  
  // Long URLs - be more lenient for legitimate sites
  if (url.length > 100) score -= 5;
  if (url.length > 150) score -= 10;
  if (url.length > 250) score -= 20;
  
  // Too many subdomains - be more lenient
  const domainParts = domain.split('.');
  if (domainParts.length > 5) score -= 15;
  if (domainParts.length > 7) score -= 25;

  // Suspicious keywords in path - only if clearly suspicious
  if (/login.*verify|account.*suspend|urgent.*update|confirm.*password|signin.*now/i.test(pathname)) {
    score -= 35;
  } else if (/login|signin|account/.test(pathname) && hasLegitTLD) {
    score -= 5; // Minor penalty for login on legitimate TLD
  }
  
  // Suspicious keywords in domain - major red flag
  if (/login|verify|account.*update|secure.*bank|confirm.*password|signin.*auth|validation.*suspend/i.test(domain)) {
    score -= 45;
  }

  // Long domain names - more lenient
  if (domain.length > 30) score -= 5;
  if (domain.length > 50) score -= 15;
  if (domain.length > 70) score -= 30;
  
  // Suspicious TLDs
  if (hasSuspiciousTLD(domain)) score -= 30;
  
  // Multiple dots in a row
  if (/\.{2,}/.test(url)) score -= 25;
  
  // URL shorteners
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link'];
  if (shorteners.some(shortener => domain.includes(shortener))) {
    score -= 15;
  }
  
  // Homograph attacks
  if (/[а-я]/.test(domain) && /[a-z]/.test(domain)) score -= 40;
  
  // Too many parameters - more lenient
  const paramCount = (pathname.match(/[&?]/g) || []).length;
  if (paramCount > 5) score -= 5;
  if (paramCount > 10) score -= 15;
  
  // Suspicious file extensions in path - only clearly bad ones
  if (/\.(php|asp|jsp)\?.*login|verify|update/.test(pathname)) score -= 20;
  
  // Random-looking domains (heuristic check)
  const mainDomain = domain.split('.')[0];
  if (mainDomain.length > 10 && !/[aeiou]{2}/.test(mainDomain)) {
    score -= 20; // Penalize domains with no double vowels (often random)
  }

  return Math.max(0, Math.min(100, score));
}

// Map score to risk label - more conservative thresholds
export function getRiskLabel(score) {
  if (score >= 85) return "Safe";
  if (score >= 65) return "Moderately Safe"; 
  if (score >= 35) return "Risky";
  return "Highly Risky";
}

// Combine heuristics + Google Safe Browsing
export async function evaluateHeuristics(url) {
  const normalizedUrl = normalizeUrl(url);
  const score = heuristicScore(normalizedUrl);
  const googlePhishing = await checkGoogleSafeBrowsing(normalizedUrl);
  const isPhishing = score < 65 || googlePhishing; // Conservative threshold
  const label = getRiskLabel(score);
  return { score, isPhishing, label };
}