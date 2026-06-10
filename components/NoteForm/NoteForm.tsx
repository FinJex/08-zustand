"use client";

import css from "./NoteForm.module.css";
import { useId } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import { useNoteDraft }from "@/lib/store/noteStore";
type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

type NewNote = {
  title: string;
  content: string;
  tag: Tag;
};

export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
//!код для зустанду
const { draft, setDraft, clearDraft } = useNoteDraft();

const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {  setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };
//!кінець коду для зустанду



  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newNote: NewNote = {
      title: (formData.get("title") as string).trim(),
      content: (formData.get("content") as string).trim(),
      tag: formData.get("tag") as Tag,
    };


    if (!newNote.title || !newNote.tag) {
      return;
    }

    mutation.mutate(newNote);

    e.currentTarget.reset();
  };

  const handleCancel = () => {
   router.push("/notes/filter/all");
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          name="title"
          className={css.input}
          value={draft?.title} onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          className={css.textarea}
          value={draft?.content} onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          value={draft?.tag} onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={css.submitButton}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}