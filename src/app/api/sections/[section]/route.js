import { sections, SECTION_NAMES } from "@/data/sections";
import { json, logRequest, maybeDelay } from "@/lib/server/http";

// GET /api/sections/:section -> { section, items }
// One handler serves the lists for the works, benefits and packages sections.
export async function GET(request, { params }) {
  const { section } = await params;
  const path = `/api/sections/${section}`;

  await maybeDelay();

  if (!Object.hasOwn(sections, section)) {
    const body = { error: `Unknown section "${section}". Use one of: ${SECTION_NAMES.join(", ")}.` };
    logRequest("GET", path, 404);
    return json(body, 404);
  }

  const items = sections[section];
  logRequest("GET", path, 200, { items: items.length });
  return json({ section, items });
}
