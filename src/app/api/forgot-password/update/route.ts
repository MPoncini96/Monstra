import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Password reset is disabled because the database layer was removed.",
    },
    { status: 501 },
  );
}
