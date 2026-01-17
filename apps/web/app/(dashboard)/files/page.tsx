import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { FilesViews } from "@/modules/files/ui/views/files-view";
import { Protect } from "@clerk/nextjs";

const Page = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <FilesViews />
        </PremiumFeatureOverlay>
      }
    >
      <FilesViews />
    </Protect>
  );
};

export default Page;
