"use client";

import type { ComponentProps } from "react";
import { ButtonLink } from "@/components/ui/Button";

export type Interest = "project-updates" | "ownership" | "both";

/** Event the enquiry form listens for to preselect an interest. */
export const INTEREST_EVENT = "nn:interest";

/**
 * A link to #enquire that also preselects the enquiry form's interest.
 * Works as a plain anchor without JS.
 */
export function InterestLink({
  interest,
  onClick,
  ...rest
}: ComponentProps<typeof ButtonLink> & { interest: Interest }) {
  return (
    <ButtonLink
      href="#enquire"
      onClick={(e) => {
        window.dispatchEvent(new CustomEvent<Interest>(INTEREST_EVENT, { detail: interest }));
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
