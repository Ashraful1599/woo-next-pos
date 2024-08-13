import cookie from "cookie";

export async function POST(req, res) {
  try {
    const { username, password } = await req.json();

    if (username === "test" && password === "12345") {
      const token = "dummy-token"; // Replace this with your token generation logic
      const headers = {
        "Set-Cookie": cookie.serialize("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24, // 1 day
          sameSite: "strict",
          path: "/",
        }),
        "Content-Type": "application/json",
      };
      const data  = {
          user_id: 123,
          user_name: "John Doe",
          user_email: "john.doe@example.com",
          outlet_id: "2",
          outlet_name: "Nutrizone 2"
      };


      return new Response(JSON.stringify({ success: true, token, ...data }), {
        status: 200,
        headers,
      });
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Username or password is incorrect!",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
