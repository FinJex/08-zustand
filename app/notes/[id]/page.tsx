
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Metadata } from "next";
import NoteDetailsClient from "./NoteDetails.client";
import { HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{id: string}>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { id } = await params;
 const note = await fetchNoteById(id);
  return{
    title: `Note: ${note.title}`,
  description: note.content.slice(0, 30),
  openGraph: {
title:`Note: ${note.title}`,
description: note.content.slice(0, 100),
url: `https://notehub.com/notes/${id}`,
images: [{
  url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
  width: 1200,
  height: 630,
  alt: note.title,
}]
  }
  }
};

const NotesPage = async ({params}: Props) => {
  const { id } = await params
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["note", id], 
    queryFn: () => fetchNoteById(id),
  });

  return (
    <div> 
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
    </div>
  );
}

export default NotesPage;
