"use client";

import * as React from "react";
import { Check, CircleAlert, type LucideIcon } from "lucide-react";
import { Icon } from "../atoms/icon";
import { Progress } from "../atoms/progress";
import { cn } from "../../lib/cn";

export type StepperStep = {
  /** Short name for the step. Sentence case, with no period. */
  label: string;
  description?: string;
  /** Shown for the current step. Under the list when horizontal, beside the marker when vertical. */
  content?: React.ReactNode;
  /** Marks a step the person can skip. */
  optional?: boolean;
  /**
   * Set false when an earlier optional step was skipped.
   * Set true to mark a step complete before the active step reaches it.
   */
  completed?: boolean;
  /** Error message. The step uses the danger treatment. */
  error?: string;
  disabled?: boolean;
  /** Shown in place of the step number until the step is complete or in error. */
  icon?: LucideIcon;
};

export type StepperVariant = "steps" | "text" | "dots" | "progress";

export type StepperProps = {
  steps: readonly StepperStep[];
  /** Zero-based. A value equal to the number of steps means every step is complete. */
  activeStep: number;
  orientation?: "horizontal" | "vertical";
  /** Horizontal only. `below` places the label under the marker. */
  labelPlacement?: "inline" | "below";
  /**
   * When `onStepChange` is set, only the current step and earlier steps open.
   * Set false to open every step that is not disabled.
   */
  linear?: boolean;
  onStepChange?: (step: number) => void;
  /** `text`, `dots`, and `progress` are the compact forms for a narrow space. */
  variant?: StepperVariant;
  /** Shown at the start of a compact stepper, or under a full stepper. */
  back?: React.ReactNode;
  /** Shown at the end of a compact stepper, or under a full stepper. */
  next?: React.ReactNode;
  /** Id of the panel the steps control. Selectable steps point at it. */
  contentId?: string;
  /** Accessible name for the sequence. */
  label?: string;
  className?: string;
};

type StepState = "complete" | "current" | "upcoming" | "error";

const stateLabel: Record<StepState, string> = {
  complete: "Completed: ",
  current: "Current: ",
  error: "Needs attention: ",
  upcoming: "",
};

function stepState(step: StepperStep, index: number, activeStep: number): StepState {
  if (step.error) return "error";
  if (index === activeStep) return "current";
  if (step.completed === true || (index < activeStep && step.completed !== false))
    return "complete";
  return "upcoming";
}

function selectable(
  step: StepperStep,
  index: number,
  activeStep: number,
  linear: boolean,
  interactive: boolean,
) {
  if (!interactive || step.disabled) return false;
  if (!linear) return true;
  return index <= activeStep;
}

function stepPosition(activeStep: number, count: number) {
  if (count === 0) return 0;
  return Math.min(count, Math.max(1, activeStep + 1));
}

function traveled(activeStep: number, count: number) {
  if (count === 0) return 0;
  if (count === 1 || activeStep >= count) return 100;
  const clamped = Math.min(Math.max(activeStep, 0), count - 1);
  return (clamped / (count - 1)) * 100;
}

function Marker({
  state,
  index,
  icon,
  className,
}: {
  state: StepState;
  index: number;
  icon?: LucideIcon;
  className?: string;
}) {
  const glyph = state === "complete" ? Check : state === "error" ? CircleAlert : icon;
  return (
    <span
      aria-hidden
      className={cn(
        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full text-xs leading-none font-medium tabular-nums transition-colors duration-150",
        state === "complete" && "bg-primary text-primary-foreground",
        state === "current" && "border-2 border-primary bg-card text-primary",
        state === "error" && "bg-danger text-danger-foreground",
        state === "upcoming" && "border border-text-4 bg-card text-text-3",
        className,
      )}
    >
      {glyph ? <Icon icon={glyph} size="sm" /> : index + 1}
    </span>
  );
}

function StepCopy({
  step,
  state,
  interactive,
  align = "start",
}: {
  step: StepperStep;
  state: StepState;
  interactive: boolean;
  align?: "start" | "center";
}) {
  return (
    <span className={cn("min-w-0", align === "center" && "text-center")}>
      {stateLabel[state] ? <span className="sr-only">{stateLabel[state]}</span> : null}
      <span
        className={cn(
          "block text-[13px]",
          state === "upcoming" ? "text-text-3" : "font-medium text-heading",
          interactive && "group-hover:text-primary",
        )}
      >
        {step.label}
      </span>
      {step.optional ? (
        <span className="mt-0.5 block text-[13px] font-normal text-text-3">Optional</span>
      ) : null}
      {step.description ? (
        <span className="mt-1 block text-[13px] font-normal text-text-2">{step.description}</span>
      ) : null}
      {step.error ? (
        <span className="mt-1 block text-[13px] font-normal text-danger">{step.error}</span>
      ) : null}
    </span>
  );
}

function StepControl({
  interactive,
  current,
  contentId,
  onSelect,
  className,
  children,
}: {
  interactive: boolean;
  current: boolean;
  contentId?: string;
  onSelect: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    className,
    interactive &&
      "group cursor-pointer rounded-sm outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
  );

  if (!interactive) return <div className={classes}>{children}</div>;

  return (
    <button
      type="button"
      className={classes}
      aria-current={current ? "step" : undefined}
      aria-controls={contentId}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

function Connector({ complete, className }: { complete: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none transition-colors duration-150",
        complete ? "bg-primary" : "bg-border",
        className,
      )}
    />
  );
}

type StepsProps = {
  steps: readonly StepperStep[];
  activeStep: number;
  linear: boolean;
  onStepChange?: (step: number) => void;
  contentId?: string;
};

function HorizontalSteps({
  steps,
  activeStep,
  linear,
  onStepChange,
  contentId,
  below,
}: StepsProps & { below: boolean }) {
  return (
    <ol
      className={cn(
        "flex w-full min-w-0",
        below
          ? "items-start overflow-x-auto py-1"
          : "flex-col @min-[32rem]/stepper:flex-row @min-[32rem]/stepper:items-start",
      )}
    >
      {steps.map((step, index) => {
        const state = stepState(step, index, activeStep);
        const current = index === activeStep;
        const interactive = selectable(step, index, activeStep, linear, onStepChange !== undefined);
        const last = index === steps.length - 1;
        const previous = steps[index - 1];
        const previousComplete = previous
          ? stepState(previous, index - 1, activeStep) === "complete"
          : false;
        const onSelect = () => onStepChange?.(index);

        if (below) {
          return (
            <li
              key={`${step.label}-${index}`}
              aria-current={!interactive && current ? "step" : undefined}
              className={cn(
                "relative flex min-w-24 flex-1 flex-col items-center px-2",
                step.disabled && "opacity-60",
              )}
            >
              {index > 0 ? (
                <Connector
                  complete={previousComplete}
                  className="absolute top-3 right-1/2 -left-1/2 z-0 h-px -translate-y-1/2"
                />
              ) : null}
              <StepControl
                interactive={interactive}
                current={current}
                contentId={contentId}
                onSelect={onSelect}
                className="relative z-10 flex w-full flex-col items-center gap-2 text-center"
              >
                <Marker state={state} index={index} icon={step.icon} />
                <StepCopy step={step} state={state} interactive={interactive} align="center" />
              </StepControl>
            </li>
          );
        }

        return (
          <li
            key={`${step.label}-${index}`}
            aria-current={!interactive && current ? "step" : undefined}
            className={cn(
              "relative flex min-w-0 items-start pb-6 last:pb-0 @min-[32rem]/stepper:pb-0",
              !last && "@min-[32rem]/stepper:min-w-40 @min-[32rem]/stepper:flex-1",
              step.disabled && "opacity-60",
            )}
          >
            <StepControl
              interactive={interactive}
              current={current}
              contentId={contentId}
              onSelect={onSelect}
              className="flex min-w-0 items-start gap-2 text-left"
            >
              <Marker state={state} index={index} icon={step.icon} />
              <StepCopy step={step} state={state} interactive={interactive} />
            </StepControl>
            {last ? null : (
              <>
                <Connector
                  complete={state === "complete"}
                  className="absolute top-6 bottom-0 left-3 w-px -translate-x-1/2 @min-[32rem]/stepper:hidden"
                />
                <Connector
                  complete={state === "complete"}
                  className="mx-4 mt-3 hidden h-px min-w-4 flex-1 -translate-y-1/2 @min-[32rem]/stepper:block"
                />
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function VerticalSteps({ steps, activeStep, linear, onStepChange, contentId }: StepsProps) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => {
        const state = stepState(step, index, activeStep);
        const current = index === activeStep;
        const interactive = selectable(step, index, activeStep, linear, onStepChange !== undefined);
        const last = index === steps.length - 1;

        return (
          <li
            key={`${step.label}-${index}`}
            aria-current={!interactive && current ? "step" : undefined}
            className={cn(
              "relative grid grid-cols-[auto_1fr] gap-x-4 pb-6 last:pb-0",
              step.disabled && "opacity-60",
            )}
          >
            {last ? null : (
              <Connector
                complete={state === "complete"}
                className="absolute top-6 bottom-0 left-3 z-0 w-px -translate-x-1/2"
              />
            )}
            <StepControl
              interactive={interactive}
              current={current}
              contentId={contentId}
              onSelect={() => onStepChange?.(index)}
              className="relative z-10 col-span-2 grid w-full grid-cols-subgrid items-start text-left"
            >
              <Marker state={state} index={index} icon={step.icon} className="self-start" />
              <StepCopy step={step} state={state} interactive={interactive} />
            </StepControl>
            {current && step.content ? (
              <div className="col-start-2 mt-4">{step.content}</div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function dotLabel(step: StepperStep, state: StepState) {
  const optional = step.optional ? ", optional" : "";
  const error = step.error ? `. ${step.error}` : "";
  return `${stateLabel[state]}${step.label}${optional}${error}`;
}

function StepDot({ state }: { state: StepState }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 rounded-full",
        state === "complete" && "bg-primary",
        state === "current" && "bg-card ring-2 ring-primary",
        state === "upcoming" && "bg-text-4",
        state === "error" && "bg-danger",
      )}
    />
  );
}

function Dots({ steps, activeStep, linear, onStepChange }: StepsProps) {
  return (
    <ol className="flex items-center justify-center">
      {steps.map((step, index) => {
        const state = stepState(step, index, activeStep);
        const current = index === activeStep;
        const interactive = selectable(step, index, activeStep, linear, onStepChange !== undefined);
        const name = dotLabel(step, state);

        return (
          <li
            key={`${step.label}-${index}`}
            aria-current={!interactive && current ? "step" : undefined}
            className="flex size-6 items-center justify-center"
          >
            {interactive ? (
              <button
                type="button"
                aria-current={current ? "step" : undefined}
                aria-label={name}
                onClick={() => onStepChange?.(index)}
                className="inline-flex size-6 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
              >
                <StepDot state={state} />
              </button>
            ) : (
              <>
                <span className="sr-only">{name}</span>
                <StepDot state={state} />
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function CompactStepper({
  steps,
  activeStep,
  variant,
  linear,
  onStepChange,
  back,
  next,
}: StepsProps & {
  variant: Exclude<StepperVariant, "steps">;
  back?: React.ReactNode;
  next?: React.ReactNode;
}) {
  const position = stepPosition(activeStep, steps.length);
  const errored = Boolean(steps[activeStep]?.error);

  return (
    <div className={cn("flex items-center", (back || next) && "gap-2")}>
      {back ? <div className="shrink-0">{back}</div> : null}
      <div className={cn("min-w-0", back || next ? "flex-1" : "w-full")}>
        {variant === "text" ? (
          <p
            className={cn(
              "text-[13px] whitespace-nowrap text-text-2",
              (back || next) && "text-center",
            )}
          >
            <span
              className={cn("font-medium tabular-nums", errored ? "text-danger" : "text-heading")}
            >
              {position}
            </span>
            {` of ${steps.length}`}
          </p>
        ) : null}
        {variant === "dots" ? (
          <Dots steps={steps} activeStep={activeStep} linear={linear} onStepChange={onStepChange} />
        ) : null}
        {variant === "progress" ? (
          <Progress
            value={traveled(activeStep, steps.length)}
            color={errored ? "danger" : "primary"}
            aria-label={`Step ${position} of ${steps.length}`}
          />
        ) : null}
      </div>
      {next ? <div className="shrink-0">{next}</div> : null}
    </div>
  );
}

function StepActions({ back, next }: { back?: React.ReactNode; next?: React.ReactNode }) {
  if (!back && !next) return null;
  return (
    <div className="mt-4 flex items-center justify-between gap-2">
      <div>{back}</div>
      <div>{next}</div>
    </div>
  );
}

export function Stepper({
  steps,
  activeStep,
  orientation = "horizontal",
  labelPlacement = "inline",
  linear = true,
  onStepChange,
  variant = "steps",
  back,
  next,
  contentId,
  label = "Steps",
  className,
}: StepperProps) {
  const shared = { steps, activeStep, linear, onStepChange, contentId };
  const horizontalContent =
    variant === "steps" && orientation === "horizontal" ? steps[activeStep]?.content : undefined;

  return (
    <nav aria-label={label} className={cn("@container/stepper max-w-full min-w-0", className)}>
      {variant === "steps" ? (
        orientation === "vertical" ? (
          <VerticalSteps {...shared} />
        ) : (
          <HorizontalSteps {...shared} below={labelPlacement === "below"} />
        )
      ) : (
        <CompactStepper {...shared} variant={variant} back={back} next={next} />
      )}
      {horizontalContent ? (
        <div key={activeStep} className="mt-4">
          {horizontalContent}
        </div>
      ) : null}
      {variant === "steps" ? <StepActions back={back} next={next} /> : null}
    </nav>
  );
}
