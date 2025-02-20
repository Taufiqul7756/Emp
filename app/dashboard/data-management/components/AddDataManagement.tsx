import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { post } from "@/lib/api/handlers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface AddDataManagementProps {
  onClose: () => void;
  page: number;
  rowsPerPage: number;
  refatch():void
}
const AddDataManagement: React.FC<AddDataManagementProps> = ({ onClose, page, rowsPerPage, refatch }) => {
  const { register, handleSubmit, reset } = useForm();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newData: {
      option1: string;
      option2: string;
      option3: string;
      option4: string;
      option5: string;
    }) => {
      return await post("/service/datamanagement", newData, {
        Authorization: `Bearer ${session?.accessToken}`,
      });
    },
    onSuccess: () => {
      toast.success("Data added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["datamanagement", page, rowsPerPage],
      });
      refatch();
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to add data: ${error.message}`);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      option1: data.option1,
      option2: data.option2,
      option3: data.option3,
      option4: data.option4,
      option5: data.option5,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl  text-red-500 font-bold mb-10">Add Data</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-96"
      >
        <input
          {...register("option1")}
          placeholder="Enter Name"
          className="border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none transition-colors w-full bg-white"
        />
        <input
          {...register("option2")}
          placeholder="Enter Number"
          className="border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none transition-colors w-full bg-white"
        />
        <input
          {...register("option3")}
          placeholder="Source of data: 60 sec, reference"
          className="border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none transition-colors w-full bg-white"
        />
        <input
          {...register("option4")}
          placeholder="Customer, Driver, Car owner, or keep empty"
          className="border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none transition-colors w-full bg-white"
        />
        <textarea
          {...register("option5")}
          placeholder="Enter text"
          className="border-2 border-gray-300 p-3 rounded-lg focus:border-red-500 focus:outline-none transition-colors w-full bg-white h-32"
        />
        <Button
          type="submit"
          className="bg-red-500 text-white mt-4 p-3 rounded-lg hover:bg-red-600 transition-colors w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default AddDataManagement;
