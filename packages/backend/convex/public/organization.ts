import { createClerkClient } from "@clerk/backend";

import { v } from "convex/values";

import { action } from "../_generated/server"; // ! jaise kya hota hai n yedi convex Db ke case mein mutation use krte hai n to third party application ke sath ye better work nhi krta hai isiliye hamne yeha per action use kr rehe hai instead of mutaion,aur jaise ki pta hai ki mutation ke sath useMutation use krte hai aur action ke sath useAction use krte hai to sabko pta hoga 😁😁😁😁.aab ye nhi puch dena ki mutation kya hota hai 😶,aur iska bahut simple sa mtlb hai yeha per ye background mein clerkclient ke api se organization id ko fetch krta hai but yeha per hamne action isiliye use kiya hai kyuki convex ke case mein mutation work nhi kr raha tha,phir se bol raha hu convex db ke case mein kabhi bhi third party Sdk ke sath mutation use nhi krna

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || " ",
});

export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (_, args) => {
    try {
      await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId,
      });

      return { valid: true };
    } catch (error) {
      return { valid: false, reason: "Organization Not Valid" };
    }
  },
});
