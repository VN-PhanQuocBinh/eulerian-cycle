import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

export function CopyButton({
  text,
  className,
  size = "sm",
  variant = "ghost",
  showText = false,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleCopy}
      className={cn("gap-2 min-w-8 min-h-8", { "p-1!": !showText }, className)}
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          {showText && <span className="text-xs">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {showText && <span className="text-xs">Copy</span>}
        </>
      )}
    </Button>
  );
}
