import { NextRequest, NextResponse } from "next/server";

export const POST = async (_request: NextRequest) => {
  return NextResponse.json(
    {
      error:
        "Password reset verification is disabled because the database layer was removed.",
    },
    { status: 501 },
  );
};
