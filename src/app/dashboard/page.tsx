import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>User: {userId}</p>
    </main>
  );
}