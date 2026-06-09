import React from "react";
import css from "./LayoutNotes.module.css";
interface Props {
    children: React.ReactNode
    sidebar: React.ReactNode
}

const LayoutNotes = ({children, sidebar}:Props) => {
    return (
<div className={css.container}>
      <div className={css.sidebar}>{sidebar}</div>
      <div className={css.notesWrapper}>{children}</div>
    </div>
    );
}

export default LayoutNotes;