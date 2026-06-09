
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{id: string}>
}

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

export default NotesPage
