"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type NDAForm = {
  purpose: string;
  effectiveDate: string;
  mndaTermDuration: string;
  mndaTermType: string;
  confidentialityDuration: string;
  confidentialityType: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1Address: string;
  party1Date: string;
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2Address: string;
  party2Date: string;
};

const today = new Date().toISOString().split("T")[0];

const defaultForm: NDAForm = {
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: today,
  mndaTermDuration: "1",
  mndaTermType: "expires",
  confidentialityDuration: "1",
  confidentialityType: "duration",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1Name: "",
  party1Title: "",
  party1Company: "",
  party1Address: "",
  party1Date: today,
  party2Name: "",
  party2Title: "",
  party2Company: "",
  party2Address: "",
  party2Date: today,
};

function substituteFields(template: string, form: NDAForm): string {
  const mndaTermValue =
    form.mndaTermType === "expires" ? `${form.mndaTermDuration} year(s)` : "termination";
  const confidentialityValue =
    form.confidentialityType === "duration" ? `${form.confidentialityDuration} year(s)` : "perpetuity";

  const replacements: [string, string][] = [
    ["Purpose", form.purpose || "[purpose]"],
    ["Effective Date", form.effectiveDate || "[effective date]"],
    ["MNDA Term", mndaTermValue],
    ["Term of Confidentiality", confidentialityValue],
    ["Governing Law", form.governingLaw || "[governing law]"],
    ["Jurisdiction", form.jurisdiction || "[jurisdiction]"],
  ];

  let result = template;
  for (const [field, value] of replacements) {
    result = result.replaceAll(`<span class="coverpage_link">${field}</span>`, `**${value}**`);
  }
  return result;
}

const inputCls =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

function PartyFields({
  prefix,
  form,
  set,
}: {
  prefix: "party1" | "party2";
  form: NDAForm;
  set: (field: keyof NDAForm, value: string) => void;
}) {
  const nameKey = `${prefix}Name` as keyof NDAForm;
  const titleKey = `${prefix}Title` as keyof NDAForm;
  const companyKey = `${prefix}Company` as keyof NDAForm;
  const addressKey = `${prefix}Address` as keyof NDAForm;
  const dateKey = `${prefix}Date` as keyof NDAForm;

  return (
    <>
      <Field label="Print Name">
        <input type="text" className={inputCls} value={form[nameKey]} onChange={(e) => set(nameKey, e.target.value)} />
      </Field>
      <Field label="Title">
        <input
          type="text"
          className={inputCls}
          value={form[titleKey]}
          onChange={(e) => set(titleKey, e.target.value)}
        />
      </Field>
      <Field label="Company">
        <input
          type="text"
          className={inputCls}
          value={form[companyKey]}
          onChange={(e) => set(companyKey, e.target.value)}
        />
      </Field>
      <Field label="Notice Address" hint="Email or postal address">
        <input
          type="text"
          className={inputCls}
          value={form[addressKey]}
          onChange={(e) => set(addressKey, e.target.value)}
        />
      </Field>
      <Field label="Date">
        <input
          type="date"
          className={inputCls}
          value={form[dateKey]}
          onChange={(e) => set(dateKey, e.target.value)}
        />
      </Field>
    </>
  );
}

function blank(v: string) {
  return v || <span className="text-gray-300 italic">—</span>;
}

function CoverPage({ form }: { form: NDAForm }) {
  const mndaTerm =
    form.mndaTermType === "expires"
      ? `Expires ${form.mndaTermDuration} year(s) from Effective Date.`
      : "Continues until terminated in accordance with the terms of the MNDA.";

  const confidentialityTerm =
    form.confidentialityType === "duration"
      ? `${form.confidentialityDuration} year(s) from Effective Date`
      : "In perpetuity";

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-2">Mutual Non-Disclosure Agreement</h1>
      <p className="text-xs text-gray-500 text-center mb-8 italic">
        This Cover Page incorporates the{" "}
        <a
          href="https://commonpaper.com/standards/mutual-nda/1.0"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          Common Paper Mutual NDA Standard Terms Version 1.0
        </a>
        . Modifications listed below control over the Standard Terms.
      </p>

      <div className="space-y-6">
        {[
          {
            title: "Purpose",
            hint: "How Confidential Information may be used",
            content: <p className="text-sm">{blank(form.purpose)}</p>,
          },
          {
            title: "Effective Date",
            content: <p className="text-sm">{blank(form.effectiveDate)}</p>,
          },
          {
            title: "MNDA Term",
            hint: "The length of this MNDA",
            content: <p className="text-sm">{mndaTerm}</p>,
          },
          {
            title: "Term of Confidentiality",
            hint: "How long Confidential Information is protected",
            content: <p className="text-sm">{confidentialityTerm}</p>,
          },
          {
            title: "Governing Law & Jurisdiction",
            content: (
              <>
                <p className="text-sm">
                  <span className="font-medium">Governing Law:</span> {blank(form.governingLaw)}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Jurisdiction:</span> {blank(form.jurisdiction)}
                </p>
              </>
            ),
          },
          {
            title: "MNDA Modifications",
            content: <p className="text-sm">{form.modifications || "None."}</p>,
          },
        ].map(({ title, hint, content }) => (
          <section key={title}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 border-b border-gray-200 pb-1 mb-2">
              {title}
            </h2>
            {hint && <p className="text-xs text-gray-400 italic mb-1">{hint}</p>}
            {content}
          </section>
        ))}
      </div>

      <p className="text-sm mt-6 mb-4">
        By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
      </p>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 pr-4 w-28 border-b border-gray-200"></th>
            <th className="py-2 px-4 font-bold text-center border border-gray-300 bg-gray-50">PARTY 1</th>
            <th className="py-2 px-4 font-bold text-center border border-gray-300 bg-gray-50">PARTY 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 pr-4 text-gray-500 font-medium">Signature</td>
            <td className="py-8 px-4 border border-gray-300">&nbsp;</td>
            <td className="py-8 px-4 border border-gray-300">&nbsp;</td>
          </tr>
          {(
            [
              ["Print Name", form.party1Name, form.party2Name],
              ["Title", form.party1Title, form.party2Title],
              ["Company", form.party1Company, form.party2Company],
              ["Notice Address", form.party1Address, form.party2Address],
              ["Date", form.party1Date, form.party2Date],
            ] as [string, string, string][]
          ).map(([label, v1, v2]) => (
            <tr key={label}>
              <td className="py-2 pr-4 text-gray-500 font-medium align-top">{label}</td>
              <td className="py-2 px-4 border border-gray-300">{blank(v1)}</td>
              <td className="py-2 px-4 border border-gray-300">{blank(v2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-gray-400 text-center mt-6">
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline"
        >
          CC BY 4.0
        </a>
        .
      </p>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState<NDAForm>(defaultForm);
  const [standardTerms, setStandardTerms] = useState<string>("");

  useEffect(() => {
    if (!sessionStorage.getItem("logged_in")) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    fetch("/Mutual-NDA.md")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.text();
      })
      .then(setStandardTerms)
      .catch(() => setStandardTerms("*Could not load standard terms.*"));
  }, []);

  function set(field: keyof NDAForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const substitutedTerms = standardTerms ? substituteFields(standardTerms, form) : "";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Mutual NDA Creator</h1>
            <p className="text-sm text-gray-500">Fill in the details to generate your agreement.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save as PDF
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 items-start">
        {/* Form — hidden when printing */}
        <div className="w-96 flex-shrink-0 space-y-5 no-print">
          <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Agreement Details</h2>

            <Field label="Purpose" hint="How Confidential Information may be used">
              <textarea
                className={inputCls}
                rows={3}
                value={form.purpose}
                onChange={(e) => set("purpose", e.target.value)}
              />
            </Field>

            <Field label="Effective Date">
              <input
                type="date"
                className={inputCls}
                value={form.effectiveDate}
                onChange={(e) => set("effectiveDate", e.target.value)}
              />
            </Field>

            <Field label="MNDA Term" hint="The length of this MNDA">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={form.mndaTermType === "expires"}
                    onChange={() => set("mndaTermType", "expires")}
                  />
                  Expires after
                  <input
                    type="number"
                    min="1"
                    className="w-14 border border-gray-300 rounded px-2 py-1 text-sm"
                    value={form.mndaTermDuration}
                    onChange={(e) => set("mndaTermDuration", e.target.value)}
                  />
                  year(s)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={form.mndaTermType === "continues"}
                    onChange={() => set("mndaTermType", "continues")}
                  />
                  Continues until terminated
                </label>
              </div>
            </Field>

            <Field label="Term of Confidentiality" hint="How long Confidential Information is protected">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={form.confidentialityType === "duration"}
                    onChange={() => set("confidentialityType", "duration")}
                  />
                  <input
                    type="number"
                    min="1"
                    className="w-14 border border-gray-300 rounded px-2 py-1 text-sm"
                    value={form.confidentialityDuration}
                    onChange={(e) => set("confidentialityDuration", e.target.value)}
                  />
                  year(s) from Effective Date
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={form.confidentialityType === "perpetuity"}
                    onChange={() => set("confidentialityType", "perpetuity")}
                  />
                  In perpetuity
                </label>
              </div>
            </Field>

            <Field label="Governing Law">
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Delaware"
                value={form.governingLaw}
                onChange={(e) => set("governingLaw", e.target.value)}
              />
            </Field>

            <Field label="Jurisdiction">
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. New Castle, DE"
                value={form.jurisdiction}
                onChange={(e) => set("jurisdiction", e.target.value)}
              />
            </Field>

            <Field label="MNDA Modifications (optional)">
              <textarea
                className={inputCls}
                rows={2}
                placeholder="List any modifications to the Standard Terms..."
                value={form.modifications}
                onChange={(e) => set("modifications", e.target.value)}
              />
            </Field>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Party 1</h2>
            <PartyFields prefix="party1" form={form} set={set} />
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Party 2</h2>
            <PartyFields prefix="party2" form={form} set={set} />
          </section>

          <button
            onClick={() => window.print()}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save as PDF
          </button>
        </div>

        {/* NDA Document — full preview, only this prints */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 nda-document">
            {/* Cover page */}
            <CoverPage form={form} />

            {/* Standard terms */}
            {substitutedTerms && (
              <>
                <hr className="my-10 border-gray-300" />
                <div className="prose prose-sm max-w-none text-gray-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{substitutedTerms}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
