// Uso: node cifrar.mjs "https://drive.google.com/drive/folders/XXX" "anairam"
// Imprime los valores s, i, d para pegar en index.html.
import { webcrypto as crypto } from "node:crypto";

const [url, clave] = process.argv.slice(2);
if (!url || !clave) {
  console.error('Uso: node cifrar.mjs "<url de drive>" "<clave>"');
  process.exit(1);
}
const b64 = (buf) => Buffer.from(buf).toString("base64");
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const km = await crypto.subtle.importKey(
  "raw", new TextEncoder().encode(clave.trim().toLowerCase()), "PBKDF2", false, ["deriveKey"]
);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" },
  km, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
);
const d = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(url));
console.log('s: "' + b64(salt) + '"');
console.log('i: "' + b64(iv) + '"');
console.log('d: "' + b64(d) + '"');
