import { packages } from "@/data/sections";
import { validateInquiry } from "@/lib/inquiry";
import { addInquiry } from "@/lib/server/inquiryStore";
import { json, logRequest, maybeDelay } from "@/lib/server/http";

const PATH = "/api/inquiries";

// POST /api/inquiries
// 201 { inquiry, position, message } | 400 { error, fields? } | 500 { error }
export async function POST(request) {
  await maybeDelay();

  let payload;
  try {
    payload = await request.json();
  } catch {
    logRequest("POST", PATH, 400, "invalid JSON");
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  try {
    const { data, errors } = validateInquiry(payload);

    if (Object.keys(errors).length > 0) {
      logRequest("POST", PATH, 400, errors);
      return json({ error: "Please fix the highlighted fields.", fields: errors }, 400);
    }

    const { inquiry, position } = addInquiry(data);
    const packageName = packages.find((p) => p.id === inquiry.package)?.name ?? inquiry.package;
    const firstName = inquiry.name.split(/\s+/)[0];

    logRequest("POST", PATH, 201, { id: inquiry.id, package: inquiry.package, position });
    return json(
      {
        inquiry,
        position,
        message: `Thanks ${firstName}, your ${packageName} request is in. You are #${position} in the queue; we reply within one business day.`,
      },
      201,
    );
  } catch (error) {
    console.error("[api] POST /api/inquiries failed", error);
    return json({ error: "Something went wrong on our side. Please try again." }, 500);
  }
}
