import { getServerSession } from "next-auth/options";
import { authOptions } from "@/helpers/authOptions";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

    console.log("🔍 Testing Chat API");
    console.log("Base URL:", BASE_API);
    console.log("User ID:", session.user.id);
    console.log("Token:", session.accessToken?.substring(0, 20) + "...");

    const response = await fetch(
      `${BASE_API}/chat/admin/all-chats?page=1&limit=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    const data = await response.json();

    return Response.json({
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error: any) {
    return Response.json(
      {
        error: error.message,
        details: error,
      },
      { status: 500 },
    );
  }
}
