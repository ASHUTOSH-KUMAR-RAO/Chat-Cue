"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@workspace/ui/components/button";

import { api } from "@workspace/backend/_generated/api";
export default function Page() {
  const users = useQuery(api.users.getMany);

  const addUser = useMutation(api.users.add);
  return (
    <>
      <Authenticated>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <p>app/web</p>
          <UserButton/>
          <OrganizationSwitcher hidePersonal={true}/>
          <Button
            onClick={() => addUser()}
            variant="outline"
            className="cursor-pointer hover:scale-200"
          >
            Add
          </Button>
          <div className="max-w-sm w-full mx-auto">
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton/>
      </Unauthenticated>
    </>
  );
}

// kabhi bhi humko yedi kisi particular aap mein kuch install krna hota hai the simply run this command "pnpm -F web add convex" ,aur hana aap ke place per jis project ke andar aad krna chahte ho usme kaar sekte ho aur haan ek aur baat ye shirf pnpm ke case mein hi use hota hai kyuki sabke sath saab compatable nhi hote hai n isiliye
