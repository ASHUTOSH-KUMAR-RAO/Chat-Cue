
import { atom } from "jotai";
import { WidgetScreen } from "@/modules/widget/types";


// Basics State Atom are like this :-
export const screenAtom = atom <WidgetScreen> ("auth")
