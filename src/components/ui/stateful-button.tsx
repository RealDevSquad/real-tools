import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

const Button = React.forwardRef<HTMLButtonElement, StatefulButtonProps>(
    ({ className, children, onClick, disabled, ...props }, ref) => {
        const [isLoading, setIsLoading] = React.useState(false);

        const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
            if (onClick) {
                try {
                    setIsLoading(true);
                    await onClick(e);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        return (
            <button
                ref={ref}
                onClick={handleClick}
                disabled={disabled || isLoading}
                className={cn(
                    "relative flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    className
                )}
                {...props}
            >
                <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
                    {children}
                </span>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                )}
            </button>
        );
    }
);
Button.displayName = "StatefulButton";

export { Button };
