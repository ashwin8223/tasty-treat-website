import { getMenuItems } from "@/app/_lib/data-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const menuItems = await getMenuItems();

    // Only expose currently available menu items to the chatbot.
    const availableItems = menuItems.filter((item) => item.isAvailable);

    return NextResponse.json(availableItems);
  } catch (error) {
    console.error("Chatbot menu API error:", error);

    return NextResponse.json(
      { error: "Unable to load menu items." },
      { status: 500 },
    );
  }
}
