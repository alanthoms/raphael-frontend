import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useBack } from "@refinedev/core";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { missionSchema } from "@/lib/schema.ts";
import * as Z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Loader2 } from "lucide-react";

const create = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(missionSchema),
    refineCoreProps: {
      resource: "missions",
      action: "create",
    },
    defaultValues: {
      status: "active",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = (values: Z.infer<typeof missionSchema>) => {
    try {
      console.log(values);
    } catch (error) {
      console.error("Error creating mission:", error);
    }
  };

  const commanders = [
    { id: "1", name: "Commander Alice" },
    { id: "2", name: "Commander Bob" },
    { id: "3", name: "Commander Carol" },
  ];

  const acps = [
    { id: 1, name: "Electronic Warfare", code: "EW" },
    {
      id: 2,
      name: "Intelligence, Surveillance, Reconnaissance",
      code: "ISR",
    },
    { id: 3, name: "Airborne Early Warning ", code: "AEW" },
  ];

  return (
    <div>
      <CreateView className="container mx-auto pb-8 px-2 sm:px-4 ">
        <Breadcrumb />
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create a new Mission
        </h1>
        <div className="flex flex-col gap-5 lg:flex-row justify-between">
          <p>Enter required mission details to create a new mission.</p>
          <Button onClick={back}> Go Back</Button>
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
                  <div className="space-y-3">
                    {" "}
                    <Label>
                      {" "}
                      Banner Image <span className="text-orange-600">*</span>
                    </Label>{" "}
                  </div>
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
                            {" "}
                            ACP <span className="text-orange-600">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field?.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ACP" />{" "}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {acps.map((acp) => (
                                <SelectItem
                                  key={acp.id}
                                  value={acp.id.toString()}
                                >
                                  {acp.name} ({acp.code})
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
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a teacher" />
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
                      name="acpId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset ID</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Assign ACP ID"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
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

export default create;
