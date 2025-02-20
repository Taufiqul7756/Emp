import { Button as ShadcnButton } from "@/components/ui/button";
import { ButtonProps as ShadcnButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ShadcnButtonProps {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = ({
  children,
  className,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) => {
  return (
    <ShadcnButton
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </ShadcnButton>
  );
};

export default Button;
