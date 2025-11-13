import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { WidgetScreen } from "@/modules/widget/types";
import { CONTACT_SESSION_KEY } from "../constants";
import { Id } from "@workspace/backend/_generated/dataModel";

// Basics State Atom are like this :-
export const screenAtom = atom<WidgetScreen>("loading");

// Error Message Atom :-

export const errorMessageAtom = atom<string | null>(null);

// Organization-scoped contact session atom :-

export const contactSessionIdAtomFamily = atomFamily((organizationId: string) =>
  atomWithStorage<Id<"contactSessions"> | null>(
    `${CONTACT_SESSION_KEY}_${organizationId}`,
    null
  )
);

export const loadingMessageAtom = atom<string | null>(null);

export const organizationIdAtom = atom<string | null>(null);
