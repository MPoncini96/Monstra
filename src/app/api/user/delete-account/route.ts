import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import prisma from "@/libs/prismaDB";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete from Clerk first, then from database
    // This way if Clerk deletion fails, we don't lose the database record
    try {
      await clerkClient.users.deleteUser(userId);
      console.log(`Successfully deleted user from Clerk: ${userId}`);
    } catch (clerkError) {
      console.error("Clerk deletion error:", clerkError);
      throw new Error(`Failed to delete from Clerk: ${clerkError}`);
    }

    // Delete from Prisma database
    try {
      await prisma.user.delete({
        where: { clerkUserId: userId },
      });
      console.log(`Successfully deleted user from database: ${userId}`);
    } catch (prismaError) {
      console.error("Prisma deletion error:", prismaError);
      throw new Error(`Failed to delete from database: ${prismaError}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: `Failed to delete account: ${error}` },
      { status: 500 }
    );
  }
}

