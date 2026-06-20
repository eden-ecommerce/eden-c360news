"use client";

import { ErrorBoundary, setTags } from "@sentry/nextjs";
import type { FC, JSXElementConstructor, ReactElement } from "react";
import type { ReactNode } from "react";

type CustomName =
  | "whole-page"
  | "header"
  | "footer"
  | "search-page-content"
  | "example-page-content";

type CustomErrorBoundaryProps = {
  children: ReactNode;
  customType: "error-boundary";
  customName: CustomName;
  fallback: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
};

export const CustomErrorBoundary: FC<CustomErrorBoundaryProps> = ({
  children,
  customType,
  customName,
  fallback,
}) => (
  <ErrorBoundary
    beforeCapture={() => {
      setTags({ customType, customName });
    }}
    fallback={fallback}
  >
    {children}
  </ErrorBoundary>
);
