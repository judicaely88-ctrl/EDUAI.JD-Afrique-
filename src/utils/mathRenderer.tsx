import React from "react";
import katex from "katex";

// Unicode converter mappings for smooth fallback and text cleaning
const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  "n": "ⁿ",
  "i": "ⁱ",
  "x": "ˣ",
};

const SUBSCRIPTS: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "=": "₌",
  "(": "₍",
  ")": "₎",
  "a": "ₐ",
  "e": "ₑ",
  "h": "ₕ",
  "i": "ᵢ",
  "j": "ⱼ",
  "k": "ₖ",
  "l": "ₗ",
  "m": "ₘ",
  "n": "ₙ",
  "p": "ₚ",
  "r": "ᵣ",
  "s": "ₛ",
  "t": "ₜ",
  "u": "ᵤ",
  "v": "ᵥ",
  "x": "ₓ",
};

/**
 * Clean up LaTeX delimiters and convert common expressions into natural, readable math
 */
export function cleanNaturalMath(input: string): string {
  if (!input) return "";

  let res = input
    // Remove unwanted raw LaTeX block delimiters
    .replace(/\\\[([\s\S]*?)\\\]/g, "$1")
    .replace(/\\\(([\s\S]*?)\\\)/g, "$1")
    .replace(/\$\$([\s\S]*?)\$\$/g, "$1")
    // Convert common greek and math symbols to proper Unicode
    .replace(/\\Delta\b/g, "Δ")
    .replace(/\\alpha\b/g, "α")
    .replace(/\\beta\b/g, "β")
    .replace(/\\gamma\b/g, "γ")
    .replace(/\\theta\b/g, "θ")
    .replace(/\\lambda\b/g, "λ")
    .replace(/\\pi\b/g, "π")
    .replace(/\\times\b/g, "×")
    .replace(/\\cdot\b/g, "·")
    .replace(/\\pm\b/g, "±")
    .replace(/\\neq\b/g, "≠")
    .replace(/\\le\b/g, "≤")
    .replace(/\\leq\b/g, "≤")
    .replace(/\\ge\b/g, "≥")
    .replace(/\\geq\b/g, "≥")
    .replace(/\\approx\b/g, "≈")
    .replace(/\\to\b/g, "→")
    .replace(/\\infty\b/g, "∞")
    .replace(/\\in\b/g, "∈")
    .replace(/\\notin\b/g, "∉")
    .replace(/\\subset\b/g, "⊂")
    .replace(/\\mathbb\{R\}/g, "ℝ")
    .replace(/\\mathbb\{C\}/g, "ℂ")
    .replace(/\\mathbb\{N\}/g, "ℕ")
    .replace(/\\mathbb\{Z\}/g, "ℤ")
    .replace(/\\mathbb\{Q\}/g, "ℚ")
    .replace(/\\emptyset\b/g, "∅");

  // Convert roots: \sqrt{...} -> √( ... )
  res = res.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");

  // Convert simple fractions: \frac{a}{b} -> (a) / (b)
  res = res.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1) / ($2)");

  // Convert simple superscripts: x^2 -> x², x^3 -> x³, etc.
  res = res.replace(/\^([0-9nix\+\-])/g, (_match, char) => SUPERSCRIPTS[char] || `^${char}`);
  res = res.replace(/\^\{([0-9nix\+\-]+)\}/g, (_match, chars) => {
    return chars
      .split("")
      .map((c: string) => SUPERSCRIPTS[c] || c)
      .join("");
  });

  // Convert simple subscripts: x_1 -> x₁, x_2 -> x₂, U_n -> Uₙ, etc.
  res = res.replace(/_([0-9a-z\+\-])/g, (_match, char) => SUBSCRIPTS[char] || `_${char}`);
  res = res.replace(/_\{([0-9a-z\+\-]+)\}/g, (_match, chars) => {
    return chars
      .split("")
      .map((c: string) => SUBSCRIPTS[c] || c)
      .join("");
  });

  return res;
}

/**
 * Safely render a mathematical block or inline expression via KaTeX
 */
export function renderKaTeXHTML(latex: string, displayMode: boolean = false): string {
  try {
    // Strip raw surrounding dollar signs
    let clean = latex.trim();
    if (clean.startsWith("$$") && clean.endsWith("$$")) {
      clean = clean.slice(2, -2).trim();
    } else if (clean.startsWith("$") && clean.endsWith("$")) {
      clean = clean.slice(1, -1).trim();
    }

    return katex.renderToString(clean, {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch (err) {
    // Return natural Unicode on error
    return `<span class="katex-fallback font-mono font-medium">${cleanNaturalMath(latex)}</span>`;
  }
}

interface MathViewProps {
  content: string;
  className?: string;
  displayMode?: boolean;
}

/**
 * MathView: Natural, book-like mathematics rendering component
 * Handles mixed text, inline formulas, and block equations.
 */
export const MathView: React.FC<MathViewProps> = ({ content, className = "", displayMode = false }) => {
  if (!content) return null;

  // If the content is purely a formula or marked with $$, render KaTeX block
  const isDedicatedFormula =
    displayMode ||
    content.startsWith("$$") ||
    content.startsWith("\\[") ||
    (content.includes("=") &&
      (content.includes("²") ||
        content.includes("Δ") ||
        content.includes("\\frac") ||
        content.includes("\\sqrt") ||
        content.includes("x₁") ||
        content.includes("x₂")));

  // Detect lines that are clearly mathematical calculation steps
  const lines = content.split("\n");

  return (
    <div className={`space-y-1.5 text-slate-800 leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Check if line contains LaTeX delimiters $...$ or $$...$$
        const hasDollarMath = /\$([^\$]+)\$/.test(trimmed);

        if (hasDollarMath) {
          const parts = trimmed.split(/(\$[^\$]+\$)/g);
          return (
            <div key={idx} className="flex flex-wrap items-center gap-1.5">
              {parts.map((part, pIdx) => {
                if (part.startsWith("$") && part.endsWith("$")) {
                  const mathCode = part.slice(1, -1);
                  const html = renderKaTeXHTML(mathCode, false);
                  return (
                    <span
                      key={pIdx}
                      className="inline-block py-0.5 px-1 bg-amber-50/60 rounded text-slate-900 font-serif"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }
                return <span key={pIdx}>{cleanNaturalMath(part)}</span>;
              })}
            </div>
          );
        }

        // If line is an explicit math equation like x² + 2x + 3 = 0, Δ = b² - 4ac, etc.
        const isMathEquationLine =
          trimmed.includes("=") &&
          (trimmed.includes("²") ||
            trimmed.includes("³") ||
            trimmed.includes("Δ") ||
            trimmed.includes("√") ||
            trimmed.includes("x₁") ||
            trimmed.includes("x₂") ||
            trimmed.includes("Uₙ") ||
            trimmed.includes("+") ||
            trimmed.includes("−") ||
            trimmed.includes("×") ||
            trimmed.includes("/"));

        // If line has fraction indicator or KaTeX syntax
        if (trimmed.includes("\\frac") || trimmed.includes("\\sqrt") || (isMathEquationLine && trimmed.length < 90)) {
          // Convert to KaTeX syntax if needed, then render
          let katexInput = trimmed
            .replace(/²/g, "^2")
            .replace(/³/g, "^3")
            .replace(/ⁿ/g, "^n")
            .replace(/₁/g, "_1")
            .replace(/₂/g, "_2")
            .replace(/₀/g, "_0")
            .replace(/ₙ/g, "_n")
            .replace(/Δ/g, "\\Delta ")
            .replace(/×/g, "\\times ")
            .replace(/−/g, "-");

          const html = renderKaTeXHTML(katexInput, false);
          return (
            <div
              key={idx}
              className="my-1.5 p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-900 overflow-x-auto shadow-xs font-serif"
            >
              <span dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          );
        }

        // Normal formatted text line with clean natural symbols
        return (
          <p key={idx} className="text-slate-800">
            {cleanNaturalMath(line)}
          </p>
        );
      })}
    </div>
  );
};

export default MathView;
