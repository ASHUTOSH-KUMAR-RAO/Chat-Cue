import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";

export const PricingTable = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 py-8 px-4">
      <ClerkPricingTable
        forOrganizations
        appearance={{
          elements: {
            // Main card styling - Dark theme
            pricingTableCard:
              "shadow-2xl border border-gray-700 rounded-2xl overflow-hidden hover:shadow-emerald-500/20 hover:border-emerald-600/50 transition-all duration-300 bg-gradient-to-b from-slate-800 to-slate-900",

            // Header styling (where price is shown)
            pricingTableCardHeader:
              "bg-slate-800/50 border-b border-gray-700 p-8",

            // Body styling (features list)
            pricingTableCardBody: "bg-slate-900 p-8",

            // Footer styling (subscribe button area)
            pricingTableCardFooter: "bg-slate-900 p-8 border-t border-gray-800",

            // All text elements - force white color
            rootBox: "text-white",

            // Plan name/title
            pricingTablePlanName: "text-2xl font-bold text-white mb-2",

            // Price container
            pricingTablePriceContainer: "text-white",

            // Price text styling
            pricingTablePrice: "text-5xl font-bold text-white mb-1",

            // Currency symbol
            pricingTablePriceCurrency: "text-white",

            // Price amount
            pricingTablePriceAmount: "text-white",

            // Billing frequency text
            pricingTableBillingFrequency: "text-gray-300 text-sm",

            // Description text
            pricingTableDescription: "text-gray-300 text-sm mt-2",

            // Feature list styling
            pricingTableFeatureList: "space-y-4",

            // Individual feature items
            pricingTableFeatureItem:
              "flex items-center gap-3 text-gray-200 text-base",

            // Checkmark icon
            pricingTableFeatureItemIcon: "text-emerald-400",

            // Feature text
            pricingTableFeatureItemText: "text-gray-200",

            // Subscribe button
            pricingTableButton:
              "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105",

            // Badge (Active badge)
            pricingTableBadge:
              "bg-emerald-600 text-white px-3 py-1 rounded-md text-sm font-semibold",
          },
        }}
      />
    </div>
  );
};
