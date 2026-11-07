// Shared rules for the "Start a project" form. The server is the source of truth
// (POST /api/inquiries runs validateInquiry); the form only reads the limits and
// package options from here so both sides stay in sync.

import { packages } from "@/data/sections";

export const PACKAGE_OPTIONS = packages.map(({ id, name }) => ({ id, name }));

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  company: { max: 120 },
  message: { min: 20, max: 2000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (value) => (typeof value === "string" ? value.trim() : "");

// Returns { data, errors }. `errors` maps field name -> message and is empty when valid.
export function validateInquiry(input) {
  const source = input && typeof input === "object" ? input : {};
  const data = {
    name: text(source.name),
    email: text(source.email).toLowerCase(),
    company: text(source.company),
    package: text(source.package),
    message: text(source.message),
  };
  const errors = {};

  if (!data.name) errors.name = "Name is required.";
  else if (data.name.length < LIMITS.name.min) errors.name = `Name must be at least ${LIMITS.name.min} characters.`;
  else if (data.name.length > LIMITS.name.max) errors.name = `Name must be ${LIMITS.name.max} characters or fewer.`;

  if (!data.email) errors.email = "Email is required.";
  else if (data.email.length > LIMITS.email.max || !EMAIL_RE.test(data.email))
    errors.email = "Enter a valid email address, like name@company.com.";

  if (data.company.length > LIMITS.company.max)
    errors.company = `Company must be ${LIMITS.company.max} characters or fewer.`;

  if (!data.package) errors.package = "Choose a package.";
  else if (!PACKAGE_OPTIONS.some((option) => option.id === data.package))
    errors.package = `Unknown package. Choose one of: ${PACKAGE_OPTIONS.map((o) => o.id).join(", ")}.`;

  if (!data.message) errors.message = "Tell us a little about the project.";
  else if (data.message.length < LIMITS.message.min)
    errors.message = `Message must be at least ${LIMITS.message.min} characters.`;
  else if (data.message.length > LIMITS.message.max)
    errors.message = `Message must be ${LIMITS.message.max} characters or fewer.`;

  return { data, errors };
}
