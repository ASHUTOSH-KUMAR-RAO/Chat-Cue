"use client";

import WidgetView from "@/modules/widget/ui/views/widget-view";
import { use } from "react";

interface Props {
  searchParams: Promise<{
    organizationId: string;
  }>;
}

const Page = ({ searchParams }: Props) => {
  const { organizationId } = use(searchParams); //* Basically jo hum yeha per 'use Hook" use kr rehe hai iska main purpose hota hai ki Promise read karna(means ke hum async data ko easily handle kr skte hai without using useEffect or useState) aur hum yeha per searchParams se organizationId ko extract kr rhe hai.
  return <WidgetView organizationId={organizationId} />;
};

export default Page;
