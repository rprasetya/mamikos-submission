import StartPage from "@/components/start/StartPage";

export const metadata = {
  title: "Get started — PX PUSH",
  description: "Start a design subscription with PX PUSH.",
};

// /start?package=pro preselects the package chosen on the pricing cards.
export default async function Start({ searchParams }) {
  const { package: initialPackage = "" } = await searchParams;
  return <StartPage initialPackage={typeof initialPackage === "string" ? initialPackage : ""} />;
}
