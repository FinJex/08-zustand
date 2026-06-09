import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { slug } = await params;
 const filter = slug.join(" / ");
  return{
    title: `${filter}`,
    description: `${filter}`,
    openGraph: {
      title: `${filter}`,
      description: `${filter}`,
      url: `https://notehub.com/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Filtered notes",
        },
      ],
    },
  };
};

const NotesPage = async ({params}:Props) => {
  const { slug } = await params;
  const filter = slug[0] === "all" ? undefined : slug[0];
  
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, filter],
    queryFn: () => fetchNotes("", 1, filter),
  });

  return (
    <div> 
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filter={slug[0]} />
    </HydrationBoundary>
    </div>
  );
};

export default NotesPage;