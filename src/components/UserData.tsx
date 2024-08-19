// Server Component: ServerMobileMenuData.tsx
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

export const getMobileMenuData = async () => {
  // Check if the user is authenticated
  const { userId: currentUserId } = auth();

  // If the user is not authenticated, return null
  if (!currentUserId) {
    return null;
  }

  // Fetch the current user's data
  let currentUser;
  try {
    currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { username: true }, // select only the username
    });

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    return currentUser;
  } catch (error) {
    // console.error(error);
    throw new Error("Something went wrong while fetching user data");
  }
};
