// Firebase Admin SDK config

const admin = require("firebase-admin");
require("dotenv").config();

function normalizePrivateKey(rawKey) {
  if (!rawKey) return "";

  let normalized = String(rawKey).trim();

  normalized = normalized.replace(/^private_key\s*=\s*/i, "");

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }

  normalized = normalized
    .replace(/\\\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const beginMatch = normalized.match(/-----BEGIN ([A-Z ]+PRIVATE KEY)-----/);
  const keyLabel = beginMatch?.[1] || "PRIVATE KEY";
  const beginMarker = `-----BEGIN ${keyLabel}-----`;
  const endMarker = `-----END ${keyLabel}-----`;
  const beginIndex = normalized.indexOf(beginMarker);
  const endIndex = normalized.indexOf(endMarker);

  if (beginIndex !== -1 && endIndex !== -1 && endIndex > beginIndex) {
    const rawBody = normalized
      .slice(beginIndex + beginMarker.length, endIndex)
      .replace(/\s+/g, "");

    const bodyLines = rawBody.match(/.{1,64}/g) || [];
    normalized = `${beginMarker}\n${bodyLines.join("\n")}\n${endMarker}\n`;
  }

  return normalized;
}

function readServiceAccountFromJsonEnv() {
  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const jsonBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;

  if (!jsonRaw && !jsonBase64) return null;

  const decoded = jsonBase64
    ? Buffer.from(jsonBase64, "base64").toString("utf8")
    : jsonRaw;

  const parsed = JSON.parse(decoded);
  return {
    project_id: parsed.project_id,
    client_email: parsed.client_email,
    private_key: normalizePrivateKey(parsed.private_key),
  };
}

const serviceAccountFromJsonEnv = readServiceAccountFromJsonEnv();

const firebaseCredentialMode = serviceAccountFromJsonEnv
  ? process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64
    ? "service-account-json-base64"
    : "service-account-json"
  : process.env.private_key || process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64
    ? "split-firebase-vars"
    : "none";

const projectId =
  serviceAccountFromJsonEnv?.project_id ||
  process.env.project_id ||
  process.env.FIREBASE_PROJECT_ID;
const clientEmail =
  serviceAccountFromJsonEnv?.client_email ||
  process.env.client_email ||
  process.env.FIREBASE_CLIENT_EMAIL;

const privateKeyRaw =
  serviceAccountFromJsonEnv?.private_key ||
  process.env.private_key ||
  process.env.FIREBASE_PRIVATE_KEY ||
  (process.env.FIREBASE_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8")
    : "");

const privateKey = normalizePrivateKey(privateKeyRaw);

const missingVars = [];
if (!projectId) missingVars.push("project_id or FIREBASE_PROJECT_ID");
if (!clientEmail) missingVars.push("client_email or FIREBASE_CLIENT_EMAIL");
if (!privateKey) missingVars.push("private_key or FIREBASE_PRIVATE_KEY");

if (missingVars.length) {
  throw new Error(`Missing Firebase env vars: ${missingVars.join(", ")}`);
}

const serviceAccount = {
  project_id: projectId,
  client_email: clientEmail,
  private_key: privateKey,
};

if (!admin.apps.length) {
  console.log(`[firebase] credential mode: ${firebaseCredentialMode}`);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
