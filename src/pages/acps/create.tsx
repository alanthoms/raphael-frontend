import React from "react";
import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useBack, useList } from "@refinedev/core";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import * as Z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { SQUADRON_OPTIONS } from "@/constants";

// ACP Form Schema
const acpSchema = Z.object({
  name: Z.string().min(1, "Name is required").max(255, "Name is too long"),
  type: Z.enum(["viper", "ghost_eye", "sentinel", "electronic_warfare"], {
    required_error: "ACP type is required",
  }),
  serialNumber: Z.string()
    .min(1, "Serial number is required")
    .max(50, "Serial number is too long")
    .regex(
      /^[A-Z0-9-]+$/,
      "Serial number must contain only uppercase letters, numbers, and hyphens",
    ),
  squadronId: Z.number({
    required_error: "Squadron is required",
  }).positive("Please select a squadron"),
  description: Z.string().max(255, "Description is too long").optional(),
});

const ACPCreate = () => {
  const Back = useBack();

  const form = useForm({
    resolver: zodResolver(acpSchema),
    refineCoreProps: {
      resource: "acps",
      action: "create",
    },
    defaultValues: {
      name: "",
      type: undefined,
      serialNumber: "",
      squadronId: undefined,
      description: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: Z.infer<typeof acpSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating ACP:", error);
    }
  };

  // ACP Type options with descriptions
  const acpTypes = [
    {
      value: "viper",
      label: "Viper",
      description: "High-speed attack drone",
    },
    {
      value: "ghost_eye",
      label: "Ghost Eye",
      description: "Stealth reconnaissance platform",
    },
    {
      value: "sentinel",
      label: "Sentinel",
      description: "Long-endurance surveillance",
    },
    {
      value: "electronic_warfare",
      label: "Electronic Warfare",
      description: "Signal jamming and ECM",
    },
  ];

  return (
    <div>
      <CreateView className="container mx-auto pb-8 px-2 sm:px-4">
        <Breadcrumb />
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create New ACP
        </h1>
        <div className="flex flex-col gap-5 lg:flex-row justify-between">
          <p>Register a new Autonomous Combat Platform to the fleet.</p>
          <Button onClick={() => Back()} variant="outline">
            Go Back
          </Button>
        </div>
        <Separator />
        <div className="my-4 flex items-center">
          <Card className="max-w-3xl gap-2 w-full mx-auto relative overflow-hidden border shadow-sm border-foreground/20">
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl pb-0 font-bold">
                ACP Registration
              </CardTitle>
            </CardHeader>

            <Separator />
            <CardContent className="mt-7">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ACP Name <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Viper-Alpha-01"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this ACP unit
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Type and Squadron Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ACP Type <span className="text-orange-600">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ACP type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {acpTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {type.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {type.description}
                                    </span>
                                  </div>
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
                      name="squadronId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Squadron <span className="text-orange-600">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            } // Correctly convert to number
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select squadron" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SQUADRON_OPTIONS.map((sq) => (
                                <SelectItem
                                  key={sq.id}
                                  value={sq.id.toString()}
                                >
                                  {" "}
                                  {/* Use the ID, not the string name */}
                                  {sq.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Serial Number */}
                  <FormField
                    control={control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Serial Number{" "}
                          <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., ACP-VIPER-2024-001"
                            {...field}
                            onChange={(e) => {
                              // Auto-uppercase serial numbers
                              field.onChange(e.target.value.toUpperCase());
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Unique serial number (uppercase letters, numbers, and
                          hyphens only)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes about this ACP unit..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional specifications, modifications, or special
                          notes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering ACP...
                      </>
                    ) : (
                      "Register ACP"
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

export default ACPCreate;
