"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFormState, useFormStatus } from "react-dom";
import { generateForm } from "../actions/generateForm";
import { useSession, signIn } from "next-auth/react";

type Props = {};

const initialState: {
  message: string;
  data?: any;
} = {
  message: "",
};

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

const FormGenerator = (props: Props) => {
  const [state, formAction] = useFormState(generateForm, initialState);
  const [open, setOpen] = useState(false);
  const session = useSession();
  console.log(session);

  useEffect(() => {
    if (state.message === "success") {
      setOpen(false);
    }
    console.log(state.data);
  }, [state.message]);

  const onFormCreate = () => {
    if (session.data?.user) {
      setOpen(true);
    } else {
      signIn();
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={onFormCreate}>Create Form</Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Enter what your form is about and what info u want to collect  and AI will do the magic"
            />
          </div>

          <DialogFooter>
            <SubmitButton />
            <Button variant="link">Create Manully</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormGenerator;
