import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useBack, useGetIdentity, useList } from "@refinedev/core";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { missionSchema } from "@/lib/schema.ts";
import * as Z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Loader2 } from "lucide-react";
import { Acp, User } from "@/types";

const Create = () => {
  const Back = useBack();

  const { data: user } = useGetIdentity<{ id: string }>();

  const form = useForm({
    resolver: zodResolver(missionSchema),
    refineCoreProps: {
      resource: "missions",
      action: "create",
    },
    defaultValues: {
      status: "active",
      commanderId: user?.id,
      operatorId: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: Z.infer<typeof missionSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating mission:", error);
    }
  };

  const { query: acpsQuery } = useList<Acp>({
    resource: "acps",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: commandersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "commander",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const { query: operatorsQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "operator" }],
  });

  const acps = acpsQuery?.data?.data || [];
  const acpsLoading = acpsQuery?.isLoading;

  const commanders = commandersQuery?.data?.data || [];
  const commandersLoading = commandersQuery?.isLoading;

  const operators = operatorsQuery?.data?.data || [];
  const operatorsLoading = operatorsQuery?.isLoading;

  return (
    <div>
      <CreateView className="container mx-auto pb-8 px-2 sm:px-4 ">
        <Breadcrumb />
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create a new Mission
        </h1>
        <div className="flex flex-col gap-5 lg:flex-row justify-between">
          <p>Enter required mission details to create a new mission.</p>
          <Button onClick={() => Back()}> Go Back</Button>
        </div>
        <Separator />
        <div className="my-4 flex items-center">
          <Card className="max-w-3xl gap-2 w-full mx-auto relative overflow-hidden border shadow-sm border-foreground/20">
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl pb-0 font-bold">
                Create New Mission
              </CardTitle>
            </CardHeader>

            <Separator />
            <CardContent className="mt-7 ">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {" "}
                          Mission Name{" "}
                          <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter mission name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="acpId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ACP <span className="text-orange-600">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field?.value?.toString()}
                            disabled={acpsLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ACP" />{" "}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {acps.map((acp: Acp) => (
                                <SelectItem
                                  key={acp.id}
                                  value={acp.id.toString()}
                                >
                                  {acp.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Status & ACP ID Row */}
                    <FormField
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">
                                Operational
                              </SelectItem>
                              <SelectItem value="inactive">Standby</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="commanderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Commander <span className="text-orange-600">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={commandersLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a commander" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {commanders.map((commander) => (
                                <SelectItem
                                  key={commander.id}
                                  value={commander.id.toString()}
                                >
                                  {commander.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="operatorId" // This collects the ID, but won't be saved in 'missions' table
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign Mission Operator</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Operator" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {operatorsQuery?.data?.data.map((op) => (
                                <SelectItem key={op.id} value={op.id}>
                                  {op.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Description */}
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Briefing</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detail the mission objectives..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      "Create Mission"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </CreateView>
    </div>
  );
};

export default Create;
