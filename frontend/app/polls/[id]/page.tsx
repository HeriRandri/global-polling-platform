import PollResultsClient from "./PollResultsClient";

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ Server Component peut utiliser async
  return <PollResultsClient pollId={id} />;
}
