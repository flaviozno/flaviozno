const fs = require("fs");
const path = require("path");

const readmePath = path.join(process.cwd(), "README.md");

const BIRTH_DATE_ISO = process.env.BIRTH_DATE_ISO || "2000-12-08";

function calculateAge(birthDateIso) {
  const birthDate = new Date(`${birthDateIso}T00:00:00Z`);
  const now = new Date();

  let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const hasNotHadBirthdayYet =
    now.getUTCMonth() < birthDate.getUTCMonth() ||
    (now.getUTCMonth() === birthDate.getUTCMonth() && now.getUTCDate() < birthDate.getUTCDate());

  if (hasNotHadBirthdayYet) {
    age -= 1;
  }

  return age;
}

function formatUtcTimestamp(date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`;
}

function main() {
  const readme = fs.readFileSync(readmePath, "utf8");

  const age = calculateAge(BIRTH_DATE_ISO);
  const timestamp = formatUtcTimestamp(new Date());

  const dynamicBlock = [
    "<!-- DYNAMIC:START -->",
    `- Age: ${age} years`,
    `- Last profile refresh: ${timestamp}`,
    "<!-- DYNAMIC:END -->"
  ].join("\n");

  const updated = readme.replace(
    /<!-- DYNAMIC:START -->[\s\S]*<!-- DYNAMIC:END -->/m,
    dynamicBlock
  );

  if (updated !== readme) {
    fs.writeFileSync(readmePath, updated);
    console.log("README dynamic section updated successfully.");
  } else {
    console.log("Dynamic markers were not found. No changes made.");
  }
}

main();
