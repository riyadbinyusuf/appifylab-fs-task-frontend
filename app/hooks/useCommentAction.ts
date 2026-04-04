import React, { startTransition, useActionState, useEffect } from "react";
import { createCommentAction } from "../actions/comments";

type ActionState = {
  success?: boolean;
  errors?: string;
  message?: string;
  inputs?: Record<string, string>;
};

type CreateCommentProps = {
  postId: number;
  parentId?: number;
  handleMutate: () => void;
};

export default function useCommentAction({
  postId,
  parentId,
  handleMutate,
}: CreateCommentProps) {
  const [state, dispatchAction, isPending] = useActionState<ActionState, FormData>(
    createCommentAction as any,
    {},
  );

  const [fields, setFields] = React.useState<Record<string, any>>({
    text: "",
    imageUrl: "",
    postId: postId,
    parentId: parentId,
  });

  const [file, setFile] = React.useState<File | null>(null);

  useEffect(() => {
    if (state.success) {
      handleMutate();
      setFile(null);
      setFields({ text: "", imageUrl: "", postId: "" });
    }
  }, [state]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  return {
    dispatchAction,
    fields,
    setFields,
    file,
    isPending,
    handleFileChange,
  };
}
