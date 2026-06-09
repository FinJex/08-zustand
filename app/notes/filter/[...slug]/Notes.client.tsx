"use client";

import Link from "next/link";
import css from "./page.module.css";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
interface NotesClientProps {
  filter: string;
} 
const NotesClient = ({ filter }: NotesClientProps) => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(1);
    },
    300
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setInputValue(value);

    updateSearchQuery(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, search, filter],
    queryFn: () => fetchNotes(search, currentPage, filter),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading notes</p>;
  }

    return (
        <div className={css.app}>
	<header className={css.toolbar}>
		{<SearchBox value={inputValue} onChange={handleChange} />}
		{data && data.totalPages > 1 && (<Pagination totalPages={data.totalPages}
     page={currentPage} setPage={setCurrentPage} />)}

   <Link href="/notes/action/create" className={css.button}>Create note +</Link>

  </header>
 {data && data.notes.length > 0 && ( <NoteList notes={data.notes} />)}
</div>
    );
};

export default NotesClient;