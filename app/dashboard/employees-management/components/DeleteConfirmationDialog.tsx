"use client";

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
// import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { del } from "@/lib/api/handlers";

interface DeleteConfirmationDialogProps {
  selectedId: number;
  trigger: React.ReactNode;
  refetch: () => void;
  onSuccess?: () => void;
  page: number;
  rowsPerPage: number;
}

interface DeleteResponse {
  success: boolean;
  message: string;
  data: {};
  error: null;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  selectedId,
  trigger,
  refetch,
  onSuccess,
  page,
  rowsPerPage,
}) => {
  // const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<DeleteResponse, Error, number>({
    mutationFn: async (selectedId) => {
      const response = await del<DeleteResponse>(
        `/users/${selectedId}`
        // { Authorization: `Bearer ${session?.accessToken}` },
      );
      if (!response || response.error || response.success === false) {
        throw new Error(response.message || "Failed to delete ads");
      }
      return response;
    },
    onSuccess: (data) => {
      setIsDialogOpen(false);
      // Invalidating both the data and count queries
      queryClient.invalidateQueries({
        queryKey: ["userdata", page, rowsPerPage],
      });
      toast.success(
        data.message || `Successfully deleted ${selectedId} ad(s)!`
      );
      onSuccess?.();
      refetch();
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
            You want to delete {selectedId}? This action cannot be undone.
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
              onClick={() => deleteMutation.mutate(selectedId)}
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

export default DeleteConfirmationDialog;
