"use client";

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { del, delMany } from "@/lib/api/handlers";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface DeleteConfirmationDialogProps {
  ids: string[];
  trigger: React.ReactNode;
  refetch: () => void;
  onSuccess?: () => void;
}

interface DeleteResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
  error: string | null;
}

const DeleteConfirmationDialogForDataManagement: React.FC<
  DeleteConfirmationDialogProps
> = ({ ids, trigger, refetch, onSuccess }) => {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const page = 1; // Define the page variable
  const rowsPerPage = 10; // Define the rowsPerPage variable

  const deleteMutation = useMutation<DeleteResponse, Error, string[]>({
    mutationFn: async (ids) => {
      const response = await delMany<DeleteResponse>(
        `/service/datamanagement`,
        { ids },
        { Authorization: `Bearer ${session?.accessToken}` }
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to delete fare");
      }
      return response;
    },
    onSuccess: (data) => {
      setIsDialogOpen(false);
      // Invalidating both the data and count queries
      queryClient.invalidateQueries({ queryKey: ["datamanagement", page, rowsPerPage] });
      refetch()
      toast.success(
        data.message || `Successfully deleted ${ids.length} orders!`
      );
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[50vh]">
        <div className="mb-5 space-y-3 text-start">
          <h2 className="text-lg font-semibold">Are you sure?</h2>
          <p className="text-sm text-muted-foreground">
            You want to delete{" "}
            {ids.length > 1 ? `these ${ids.length} orders` : "this order"}? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-6">
            <Button
              variant="default"
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-200 text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteMutation.mutate(ids)}
              className="bg-primary-500 text-white hover:bg-primary-300"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialogForDataManagement;
