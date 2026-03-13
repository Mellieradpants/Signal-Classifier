const analyzeBtn = document.getElementById("analyzeBtn");
const inputText = document.getElementById("inputText");
const results = document.getElementById("results");

const classificationEl = document.getElementById("classification");
const evidenceDomainsEl = document.getElementById("evidenceDomains");
const expectedSignalsEl = document.getElementById("expectedSignals");
const detectedSignalsEl = document.getElementById("detectedSignals");
const missingSignalsEl = document.getElementById("missingSignals");
const statusEl = document.getElementById("status");
const reviewReasonEl = document.getElementById("reviewReason");

const library = {
  scientific: {
    evidenceDomains: ["Scholarly Research", "Scientific Agencies", "Data Repositories"],
    expectedSignals: ["study name", "journal name", "DOI", "institution name", "sample size", "publication date"]
  },
  policy: {
    evidenceDomains: ["Government Records", "Legislative Records"],
    expectedSignals: ["agency name", "bill number", "rule number", "official report", "effective date"]
  },
  legal: {
    evidenceDomains: ["Legal Records", "Government Records"],
    expectedSignals: ["case name", "statute citation", "regulation citation", "court name", "decision date"]
  },
  corporate: {
    evidenceDomains: ["Corporate Disclosures", "Media Records"],
    expectedSignals: ["company name", "filing reference", "earnings report", "executive name", "announcement date"]
  },
  event: {
    evidenceDomains: ["Media Records", "Government Records", "Archival Records"],
    expectedSignals: ["event date", "location", "named parties", "official statement", "timestamp"]
  },
  historical: {
    evidenceDomains: ["Archival Records", "Library Collections", "Scholarly Research"],
    expectedSignals: ["date", "archive reference", "document title", "historical actor", "primary source reference"]
  },
  statistical: {
    evidenceDomains: ["Data Repositories", "Government Records", "Scholarly Research"],
    expectedSignals: ["percentage", "sample size", "dataset name", "time range", "method reference"]
  },
  identity: {
    evidenceDomains: ["Institutional Records", "Media Records", "Library Collections"],
    expectedSignals: ["full name", "organization name", "role title", "bio reference", "official profile"]
  },
  credential: {
    evidenceDomains: ["Institutional Records", "Government Records", "Library Collections"],
    expectedSignals: ["license number", "issuing body", "degree name", "certification name", "credential date"]
  },
  media: {
    evidenceDomains: ["Media Records", "Library Collections", "Archival Records"],
    expectedSignals: ["publisher name", "author name", "publication date", "headline", "archive reference"]
  },
  authenticity: {
    evidenceDomains: ["Media Records", "Archival Records", "Technical Standards"],
    expectedSignals: ["original source", "timestamp", "metadata", "version reference", "chain of custody"]
  },
  other: {
    evidenceDomains: ["Human Review"],
    expectedSignals: []
  }
};

function classifyText(text) {
  const lower = text.toLowerCase();

  if (lower.includes("study") || lower.includes("trial") || lower.includes("research")) return "scientific";
  if (lower.includes("bill") || lower.includes("policy") || lower.includes("agency")) return "policy";
  if (lower.includes("court") || lower.includes("law") || lower.includes("statute")) return "legal";
  if (lower.includes("company") || lower.includes("ceo") || lower.includes("earnings")) return "corporate";
  if (lower.includes("today") || lower.includes("happened") || lower.includes("announced")) return "event";
  if (lower.includes("history") || lower.includes("archived") || lower.includes("historical")) return "historical";
  if (/\d+%/.test(text) || lower.includes("percent") || lower.includes("data")) return "statistical";
  if (lower.includes("is a") || lower.includes("works at") || lower.includes("profile")) return "identity";
  if (lower.includes("certified") || lower.includes("licensed") || lower.includes("degree")) return "credential";
  if (lower.includes("article") || lower.includes("reported") || lower.includes("published")) return "media";
  if (lower.includes("authentic") || lower.includes("fake") || lower.includes("edited")) return "authenticity";

  return "other";
}

function detectSignals(text, expectedSignals) {
  const lower = text.toLowerCase();
  const detected = [];

  expectedSignals.forEach(signal => {
    if (signal.includes("date") && /\b(19|20)\d{2}\b/.test(text)) detected.push(signal);
    else if (signal.includes("percentage") && (/\d+%/.test(text) || lower.includes("percent"))) detected.push(signal);
    else if (signal.includes("institution") && (
      lower.includes("university") ||
      lower.includes("nih") ||
      lower.includes("cdc") ||
      lower.includes("congress")
    )) detected.push(signal);
    else if (signal.includes("agency") && (
      lower.includes("agency") ||
      lower.includes("department") ||
      lower.includes("cdc") ||
      lower.includes("fda")
    )) detected.push(signal);
    else if (signal.includes("company") && (
      lower.includes("inc") ||
      lower.includes("corp") ||
      lower.includes("company") ||
      lower.includes("ceo")
    )) detected.push(signal);
    else if (signal.includes("court") && lower.includes("court")) detected.push(signal);
    else if (signal.includes("headline") && text.length < 180) detected.push(signal);
  });

  return detected;
}

analyzeBtn.addEventListener("click", () => {
  const text = inputText.value.trim();

  if (!text) {
    alert("Paste text first.");
    return;
  }

  const classification = classifyText(text);
  const rule = library[classification];

  const detectedSignals = detectSignals(text, rule.expectedSignals);
  const missingSignals = rule.expectedSignals.filter(signal => !detectedSignals.includes(signal));

  let status = "signals_undetected";
  let reviewReason = "No expected evidence signals were detected.";

  if (detectedSignals.length > 0 && missingSignals.length === 0) {
    status = "most_detected";
    reviewReason = "Most expected evidence signals were detected in the text.";
  } else if (detectedSignals.length > 0 && missingSignals.length > 0) {
    status = "signals_incomplete";
    reviewReason = "Some expected evidence signals were detected, but important signals are still missing.";
  } else if (classification === "other") {
    status = "needs_human_review";
    reviewReason = "The text does not fit the current taxonomy cleanly.";
  }

  classificationEl.textContent = classification;
  evidenceDomainsEl.textContent = rule.evidenceDomains.join(", ") || "—";
  expectedSignalsEl.textContent = rule.expectedSignals.join(", ") || "—";
  detectedSignalsEl.textContent = detectedSignals.join(", ") || "—";
  missingSignalsEl.textContent = missingSignals.join(", ") || "—";
  statusEl.textContent = status;
  reviewReasonEl.textContent = reviewReason;

  results.classList.remove("hidden");
});
