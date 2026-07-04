import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "images", "products");
mkdirSync(outDir, { recursive: true });

const MAROON = "#7a1f2b";
const MAROON_DEEP = "#4a1017";
const TAN = "#d9be94";
const CREAM = "#faf3e6";
const GOLD = "#b9922f";

const ICONS = {
  Earrings:
    '<circle cx="0" cy="-40" r="10" fill="none" stroke="{c}" stroke-width="3"/><path d="M0,-30 C -22,-10 -22,30 0,46 C 22,30 22,-10 0,-30 Z" fill="none" stroke="{c}" stroke-width="3"/>',
  Necklaces:
    '<path d="M -70,-50 C -70,20 -30,60 0,60 C 30,60 70,20 70,-50" fill="none" stroke="{c}" stroke-width="3"/><circle cx="0" cy="60" r="14" fill="none" stroke="{c}" stroke-width="3"/>',
  Rings:
    '<circle cx="0" cy="10" r="42" fill="none" stroke="{c}" stroke-width="8"/><path d="M -16,-32 L 0,-58 L 16,-32 Z" fill="none" stroke="{c}" stroke-width="3" stroke-linejoin="round"/>',
  Bracelets:
    '<ellipse cx="0" cy="0" rx="60" ry="34" fill="none" stroke="{c}" stroke-width="8"/><ellipse cx="0" cy="0" rx="60" ry="34" fill="none" stroke="{c}" stroke-width="1" stroke-dasharray="4 6" opacity="0.6"/>',
  Accessories:
    '<path d="M -40,-10 C -40,-38 40,-38 40,-10 L 40,20 C 40,40 -40,40 -40,20 Z" fill="none" stroke="{c}" stroke-width="3"/><path d="M -40,-10 C -40,10 40,10 40,-10" fill="none" stroke="{c}" stroke-width="3"/>',
};

const products = [
  [1, "Pearl Bloom Huggie Earrings", "Earrings"],
  [2, "Hammered Dome Stud Earrings", "Earrings"],
  [3, "Pearl Drop Gold Hoops", "Earrings"],
  [4, "Ridged Gold Huggies", "Earrings"],
  [5, "Sunburst Drop Earrings", "Earrings"],
  [6, "Antique Bloom Ring Set", "Rings"],
  [7, "Teal Charm Bookmark Necklace", "Accessories"],
  [8, "Beaded Heart Pendant Necklace", "Necklaces"],
  [9, "Scalloped Shell Cuff & Bangle Set", "Bracelets"],
  [10, "Stone Cluster Statement Ring", "Rings"],
  [11, "Colorblock Enamel Stud Earrings", "Earrings"],
  [12, "Gilded Seashell Trinket Box", "Accessories"],
  [13, "Tortoise Shell Hoop Earrings", "Earrings"],
  [14, "Rose Motif Pendant Necklace", "Necklaces"],
  [15, "Garnet Heart Pendant Necklace", "Necklaces"],
  [16, "Noir Rose Pendant Necklace", "Necklaces"],
  [17, "Hammered Chain-Link Ring", "Rings"],
  [18, "Crossover Twist Ring", "Rings"],
  [19, "Solitaire Cocktail Ring", "Rings"],
  [20, "Cherry Drop Earrings", "Earrings"],
  [21, "Mixed Gold Ring Stack", "Rings"],
  [22, "Chrome Teardrop Earrings", "Earrings"],
  [23, "Panther Link Bracelet", "Bracelets"],
  [24, "Four Leaf Clover Necklace", "Necklaces"],
  [25, "Pearl & Heart Charm Necklace", "Necklaces"],
  [26, "Cinderella Charm Bracelet", "Bracelets"],
  [27, "Repunzel Charm Bracelet", "Bracelets"],
];

function svgFor(name, category) {
  const icon = (ICONS[category] ?? ICONS.Accessories).replaceAll("{c}", GOLD);
  const words = name.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 22) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);

  const escapeXml = (s) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  // Caption block sits below the icon, must stay inside the 500-tall
  // viewBox alongside the wordmark at the very bottom.
  const captionStartY = 380;
  const textLines = lines
    .map(
      (l, i) =>
        `<text x="200" y="${captionStartY + i * 32}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="${MAROON_DEEP}">${escapeXml(l)}</text>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 400 500">
  <defs>
    <pattern id="check" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="${TAN}"/>
      <rect width="8" height="16" fill="${MAROON}" opacity="0.55"/>
      <rect width="16" height="8" fill="${MAROON}" opacity="0.55"/>
    </pattern>
  </defs>
  <rect width="400" height="500" fill="${CREAM}"/>
  <rect width="400" height="500" fill="url(#check)" opacity="0.14"/>
  <rect x="16" y="16" width="368" height="468" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
  <g transform="translate(200,190)">${icon}</g>
  ${textLines}
  <text x="200" y="454" text-anchor="middle" font-family="Georgia, serif" font-size="13" letter-spacing="4" fill="${GOLD}">AURASIL</text>
</svg>`;
}

for (const [n, name, category] of products) {
  const file = join(outDir, `product-${String(n).padStart(2, "0")}.svg`);
  writeFileSync(file, svgFor(name, category), "utf8");
}

console.log(`Generated ${products.length} placeholder SVGs in ${outDir}`);
