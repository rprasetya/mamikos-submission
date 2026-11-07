"use client";

import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { submitInquiry } from "@/lib/api";
import { LIMITS, PACKAGE_OPTIONS } from "@/lib/inquiry";
import { fonts, mq } from "@/styles/theme";

// "Start a project" form -> POST /api/inquiries.
// Validation lives on the server (noValidate here), so a 400 response is the
// source of the per-field messages. States: idle | submitting | success, plus
// a banner for network/server failures that keeps everything the user typed.

const EMPTY = { name: "", email: "", company: "", package: "", message: "" };
const FIELD_ORDER = ["name", "email", "company", "package", "message"];

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Field = styled.div`
  display: grid;
  grid-template-columns: 12vw 1fr;
  align-items: baseline;
  gap: 1vw;
  padding: 1vw 0;
  border-bottom: var(--border);

  &:first-of-type {
    border-top: var(--border);
  }

  ${(p) =>
    p.invalid &&
    css`
      border-bottom-color: var(--red);
    `}

  ${mq.mobile} {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 14px 0;
  }
`;

const LabelText = styled.label`
  font-family: ${fonts.mono};
  font-size: 50%;
  letter-spacing: -0.05vw;
  text-transform: uppercase;
  opacity: 0.7;

  ${mq.mobile} {
    font-size: 11px;
  }
`;

const control = css`
  width: 100%;
  padding: 0.3vw 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font-family: ${fonts.display};
  font-size: 2vw;
  line-height: 1.1;
  outline: none;

  &::placeholder {
    color: currentColor;
    opacity: 0.3;
  }

  &:focus-visible {
    box-shadow: 0 1px 0 0 currentColor;
  }

  ${mq.mobile} {
    font-size: 22px;
  }
`;

const Input = styled.input`
  ${control}
`;

const Select = styled.select`
  ${control}
  appearance: none;
  cursor: pointer;

  option {
    color: #000;
  }
`;

const Textarea = styled.textarea`
  ${control}
  min-height: 8vw;
  resize: vertical;

  ${mq.mobile} {
    min-height: 120px;
  }
`;

const FieldError = styled.p`
  grid-column: 2;
  color: #ff6b7a;
  font-family: ${fonts.mono};
  font-size: 50%;
  letter-spacing: -0.02vw;

  ${mq.mobile} {
    grid-column: 1;
    font-size: 12px;
  }
`;

const Hint = styled.span`
  grid-column: 2;
  font-family: ${fonts.mono};
  font-size: 45%;
  opacity: 0.5;

  ${mq.mobile} {
    grid-column: 1;
    font-size: 11px;
  }
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  margin-bottom: 2vw;
  padding: 1.2vw 1.4vw;
  border: 1px solid currentColor;
  font-family: ${fonts.mono};
  font-size: 60%;

  strong {
    font-weight: 400;
    text-transform: uppercase;
  }

  ${(p) =>
    p.tone === "error" &&
    css`
      border-color: #ff6b7a;
      color: #ffb3bb;
    `}
  ${(p) =>
    p.tone === "success" &&
    css`
      border-color: var(--green);
      color: #c9ffd6;
    `}

  ${mq.mobile} {
    gap: 8px;
    margin-bottom: 24px;
    padding: 14px;
    font-size: 13px;
  }
`;

const Submit = styled.button`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 3vw;
  padding: 1vw;
  background: var(--grey);
  color: var(--background);
  font-family: ${fonts.mono};
  font-size: 70%;
  letter-spacing: -0.05vw;
  text-align: left;
  transition: background-color 0.2s ease;

  &:disabled {
    cursor: progress;
    opacity: 0.6;
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      background: #fff;
    }
  }

  ${mq.mobile} {
    margin-top: 32px;
    padding: 12px 10px;
    font-size: 14px;
  }
`;

const TextButton = styled.button`
  align-self: flex-start;
  font-family: ${fonts.mono};
  text-decoration: underline;
  text-transform: uppercase;
`;

export default function StartForm({ initialPackage = "" }) {
  const validInitial = PACKAGE_OPTIONS.some((o) => o.id === initialPackage) ? initialPackage : "";
  const [values, setValues] = useState({ ...EMPTY, package: validInitial });
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState(null); // { tone, title, message }
  const formRef = useRef(null);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setBanner(null);
    setFieldErrors({});

    try {
      const result = await submitInquiry(values);
      setStatus("success");
      setValues({ ...EMPTY });
      setBanner({ tone: "success", title: "Request received", message: result.message });
    } catch (error) {
      setStatus("idle");
      if (error.kind === "validation") {
        const fields = error.fields ?? {};
        setFieldErrors(fields);
        setBanner({ tone: "error", title: "Check the form", message: error.message });
        const first = FIELD_ORDER.find((name) => fields[name]);
        if (first) formRef.current?.elements.namedItem(first)?.focus();
      } else if (error.kind === "network") {
        setBanner({ tone: "error", title: "No connection", message: `${error.message} Your answers are still here.` });
      } else {
        setBanner({ tone: "error", title: `Server error (${error.status})`, message: error.message });
      }
    }
  };

  const errorId = (name) => (fieldErrors[name] ? `${name}-error` : undefined);

  if (status === "success") {
    return (
      <Banner tone="success" role="status" aria-live="polite">
        <strong>● {banner.title}</strong>
        <span>{banner.message}</span>
        <TextButton
          type="button"
          onClick={() => {
            setStatus("idle");
            setBanner(null);
          }}
        >
          Send another request
        </TextButton>
      </Banner>
    );
  }

  return (
    <Form ref={formRef} onSubmit={submit} noValidate aria-describedby={banner ? "form-banner" : undefined}>
      {banner && (
        <Banner as="section" id="form-banner" tone={banner.tone} role="alert">
          <strong>● {banner.title}</strong>
          <span>{banner.message}</span>
        </Banner>
      )}

      <Field invalid={!!fieldErrors.name}>
        <LabelText htmlFor="name">Name</LabelText>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={values.name}
          onChange={update}
          maxLength={LIMITS.name.max}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={errorId("name")}
        />
        {fieldErrors.name && <FieldError id="name-error">{fieldErrors.name}</FieldError>}
      </Field>

      <Field invalid={!!fieldErrors.email}>
        <LabelText htmlFor="email">Email</LabelText>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="name@company.com"
          value={values.email}
          onChange={update}
          maxLength={LIMITS.email.max}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={errorId("email")}
        />
        {fieldErrors.email && <FieldError id="email-error">{fieldErrors.email}</FieldError>}
      </Field>

      <Field invalid={!!fieldErrors.company}>
        <LabelText htmlFor="company">Company</LabelText>
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          placeholder="Optional"
          value={values.company}
          onChange={update}
          maxLength={LIMITS.company.max}
          aria-invalid={!!fieldErrors.company}
          aria-describedby={errorId("company")}
        />
        {fieldErrors.company && <FieldError id="company-error">{fieldErrors.company}</FieldError>}
      </Field>

      <Field invalid={!!fieldErrors.package}>
        <LabelText htmlFor="package">Package</LabelText>
        <Select
          id="package"
          name="package"
          value={values.package}
          onChange={update}
          aria-invalid={!!fieldErrors.package}
          aria-describedby={errorId("package")}
        >
          <option value="">Choose a package ↓</option>
          {PACKAGE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </Select>
        {fieldErrors.package && <FieldError id="package-error">{fieldErrors.package}</FieldError>}
      </Field>

      <Field invalid={!!fieldErrors.message}>
        <LabelText htmlFor="message">Project</LabelText>
        <Textarea
          id="message"
          name="message"
          placeholder="What do you need designed first?"
          value={values.message}
          onChange={update}
          maxLength={LIMITS.message.max}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={errorId("message") ?? "message-hint"}
        />
        {fieldErrors.message ? (
          <FieldError id="message-error">{fieldErrors.message}</FieldError>
        ) : (
          <Hint id="message-hint">
            {values.message.trim().length}/{LIMITS.message.min}+ characters
          </Hint>
        )}
      </Field>

      <Submit type="submit" disabled={status === "submitting"}>
        <span>{status === "submitting" ? "Sending request…" : "Send request"}</span>
        <span aria-hidden="true">↗</span>
      </Submit>
    </Form>
  );
}
