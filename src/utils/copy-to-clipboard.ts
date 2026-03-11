export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API (recommended)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-HTTPS contexts
    return copyToClipboardLegacy(text);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Legacy method using execCommand (for older browsers)
 */
function copyToClipboardLegacy(text: string): boolean {
  try {
    // Create temporary textarea
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Make it invisible
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.setAttribute("readonly", "");

    document.body.appendChild(textarea);

    // Select and copy
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const success = document.execCommand("copy");

    // Cleanup
    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.error("Legacy copy failed:", error);
    return false;
  }
}