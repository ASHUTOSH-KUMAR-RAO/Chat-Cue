
"use client"

import { PricingTable } from "../components/pricing-table"


export const BillingView = ()=>{
  return (
    <div className="flex min-h-screen flex-col p-8">
        <div className="mx-auto w-full max-w-3xl">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-4xl">Plan&apos;s & Billing</h1>
              <p>choose the plan that&apos;sright for you</p>
            </div>
            <div className="mt-8">
                <PricingTable/>
            </div>
        </div>
    </div>
  )
}
