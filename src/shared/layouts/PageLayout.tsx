import React from "react";
import clsx from "clsx";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center min-h-screen",
        className
      )}
    >
      {children}
    </div>
  );
};
