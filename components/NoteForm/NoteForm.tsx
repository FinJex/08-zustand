"use client";
import css from "./NoteForm.module.css";
import { useId, useActionState } from "react";
import { createNote } from "../../lib/api";
import { useRouter } from "next/navigation";



type NewNote = {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
};

type Note = {
  id: string;
  title: string;
  content: string;
  tag: string;
};

const initialState: Note | null = null;

export default function NoteForm() {
  const fieldId = useId();
const router = useRouter();
 
  const action = async (_prevState: Note | null,formData: FormData): Promise<Note | null> => {
    const newNote: NewNote = {
      title: String(formData.get("title") || ""),
      content: String(formData.get("content") || ""),
      tag: formData.get("tag") as NewNote["tag"],
    };

    const created = await createNote(newNote);
    return created;
  };

  const [, formAction, isPending] = useActionState(action, initialState);

const handleCancel = () => {
router.back();
}

  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          name="title"
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel} className={css.cancelButton}>
          Cancel
        </button>

        <button type="submit" disabled={isPending} className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
