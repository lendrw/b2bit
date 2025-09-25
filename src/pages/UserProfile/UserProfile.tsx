import React from "react";
import { useAuthContext } from "../../shared/contexts";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import { PageLayout } from "@/shared/layouts/PageLayout";
import { Button } from "@/components/ui/button";

export function Spinner() {
  return <Loader2 className="h-10 w-10 animate-spin text-[#02274F]" />;
}

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuthContext();

  if (!user)
    return (
      <PageLayout>
        <Spinner />
      </PageLayout>
    );

  return (
    <PageLayout className=" bg-[#F1F5F9]">
      <div className="fixed top-0 left-0 bg-[#FDFDFD] w-full h-[1.8cm] flex items-center justify-center sm:justify-end sm:pr-20 z-50">
        <Button
          onClick={logout}
          className="bg-[#02274F] hover:bg-[#02274fe5] w-[6.9cm] h-[1.1cm] text-base cursor-pointer"
        >
          Logout
        </Button>
      </div>

      <Card className="bg-[#FDFDFD] w-[9cm] h-[8cm] flex items-center justify-center p-6 rounded-2xl shadow-[0_0_10px_0_rgba(220,220,220,1)] border-0">
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-xs">Profile picture</h3>
          <img
            src={user.avatar.high}
            alt="Profile"
            className="w-[1.4cm] h-[1.4cm] rounded-md object-cover object-center"
          />
        </div>
        <div className="w-full">
          <Label className="text-sm font-light text-[#262626]">
            Your <span className="font-semibold">Name</span>
          </Label>
          <Input
            type="text"
            value={user.name}
            readOnly
            className="!text-xs font-light bg-[#F4F4F4] border-0 h-[1cm]"
          />
        </div>
        <div className="w-full">
          <Label className="text-sm font-light text-[#262626]">
            Your <span className="font-semibold">E-mail</span>
          </Label>
          <Input
            type="email"
            value={user.email}
            readOnly
            className="!text-xs font-light bg-[#F4F4F4] border-0 h-[1cm]"
          />
        </div>
      </Card>
    </PageLayout>
  );
};
