import { useShow } from "@refinedev/core";
import { Mission } from "@/types";
import React from "react";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Show = () => {
  const { query } = useShow<Mission>({ resource: "missions" });

  const missionDetails = query.data?.data;

  const { isLoading, isError } = query;

  if (isLoading || isError || !missionDetails) {
    return (
      <ShowView className="container mx-auto pb-8 px-2 sm:px-4">
        <ShowViewHeader title="Mission Details" resource="missions">
          <p>
            {isLoading
              ? "Loading Mission Details"
              : isError
              ? "Failed To Load Mission Details"
              : "Mission Details Not Found"}
          </p>
        </ShowViewHeader>
      </ShowView>
    );
  }

  const commanderName = missionDetails.commander?.name ?? "unknown";

  const { name, description, status, createdAt, acp } = missionDetails;

  return (
    <ShowView className="container mx-auto pb-8 px-2 sm:px-4 ">
      <ShowViewHeader title="Mission Details" resource="missions" />
      <Card className="p-6 sm:p-8 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-4">
          <div className="flex-1 space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold">{name}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div>
            <Badge variant={status == "active" ? "default" : "secondary"}>
              {status}
            </Badge>
          </div>
        </div>

        <Separator />
        <div className="grid sm:grid-cols-2 mt-3 gap-10 text-sm">
          <div>
            <p className="text-xs mb-3 font-bold text-gray-400 uppercase tracking-wider;">
              Commander
            </p>

            <p className="text-xs mb-3 font-bold text-gray-100 uppercase tracking-wider;">
              {commanderName}
            </p>
          </div>
          <div>
            <div className="space-y-2">
              <p className="text-xs mb-3 font-bold text-gray-400 uppercase tracking-wider;">
                Created At:
              </p>

              <p className="text-xs mb-3 font-bold text-gray-100 uppercase tracking-wider;">
                {createdAt}
              </p>
            </div>
          </div>
        </div>

        <Separator />
        <div className="grid sm:grid-cols-2 mt-3 gap-10 text-sm">
          <div>
            <p className="text-xs mb-3 font-bold text-gray-400 uppercase tracking-wider;">
              ACP
            </p>

            <p className="text-xs mb-3 font-bold text-gray-100 uppercase tracking-wider;">
              {acp?.name ?? "NA"}
            </p>
          </div>
          <div>
            <div className="space-y-2">
              <p className="text-xs mb-3 font-bold text-gray-400 uppercase tracking-wider;">
                ACP Description
              </p>

              <p className="text-xs mb-3 font-bold text-gray-100 uppercase tracking-wider;">
                {acp?.description}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </ShowView>
  );
};

export default Show;
