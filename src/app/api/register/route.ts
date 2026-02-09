import { NextResponse } from "next/server";

export async function POST(_request: any) {
  return NextResponse.json(
    {
      error:
        "Registration is disabled because the database layer was removed.",
    },
    { status: 501 },
  );
}
