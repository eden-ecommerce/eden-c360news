"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type StepDefinition<TStep extends string = string> = {
  value: TStep;
  label: string;
};

type MultiStepFormContextValue = {
  activeStep: string;
  goToStep: (step: string) => void;
  steps: StepDefinition[];
  isFirstStep: boolean;
  isLastStep: boolean;
};

const MultiStepFormContext = createContext<MultiStepFormContextValue | null>(null);

type MultiStepFormProviderProps<TStep extends string> = {
  steps: StepDefinition<TStep>[];
  activeStep: TStep;
  onActiveStepChange: (step: TStep) => void;
  children: ReactNode;
};

export function MultiStepFormProvider<TStep extends string>({
  steps,
  activeStep,
  onActiveStepChange,
  children,
}: MultiStepFormProviderProps<TStep>) {
  const activeIndex = steps.findIndex((step) => step.value === activeStep);

  const value = useMemo(
    (): MultiStepFormContextValue => ({
      activeStep,
      goToStep: (step) => onActiveStepChange(step as TStep),
      steps,
      isFirstStep: activeIndex <= 0,
      isLastStep: activeIndex >= steps.length - 1,
    }),
    [activeStep, activeIndex, onActiveStepChange, steps],
  );

  return (
    <MultiStepFormContext.Provider value={value}>{children}</MultiStepFormContext.Provider>
  );
}

export function useMultiStepForm<TStep extends string = string>() {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error("useMultiStepForm must be used within MultiStepFormProvider");
  }

  return {
    ...context,
    activeStep: context.activeStep as TStep,
    goToStep: (step: TStep) => context.goToStep(step),
    steps: context.steps as StepDefinition<TStep>[],
  };
}
