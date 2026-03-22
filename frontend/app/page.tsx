"use client";

import { useState, useEffect, useRef } from "react";
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

type ChatMessage = { role: "user" | "assistant"; content: string };

const today = new Date().toISOString().split("T")[0];

const defaultForm: NDAForm = {
  purpose: "",
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const apiMessages = useRef<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Fetch initial greeting from AI on mount
  useEffect(() => {
    const trigger: ChatMessage = { role: "user", content: "Hello" };
    apiMessages.current = [trigger];
    setLoading(true);
    fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages.current }),
    })
      .then((r) => r.json())
      .then((data) => {
        const aiMsg: ChatMessage = { role: "assistant", content: data.reply };
        apiMessages.current.push(aiMsg);
        setDisplayMessages([aiMsg]);
        if (data.fields) setForm((prev) => ({ ...prev, ...data.fields }));
      })
      .catch(() => {
        setDisplayMessages([{ role: "assistant", content: "Hello! I'm here to help you create a Mutual NDA. What is the purpose of this agreement?" }]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    apiMessages.current.push(userMsg);
    setDisplayMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages.current }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = { role: "assistant", content: data.reply };
      apiMessages.current.push(aiMsg);
      setDisplayMessages((prev) => [...prev, aiMsg]);
      if (data.fields) setForm((prev) => ({ ...prev, ...data.fields }));
    } finally {
      setLoading(false);
    }
  }

  const substitutedTerms = standardTerms ? substituteFields(standardTerms, form) : "";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Mutual NDA Creator</h1>
            <p className="text-sm text-gray-500">Chat with AI to generate your agreement.</p>
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
        {/* Chat panel — hidden when printing */}
        <div className="w-96 flex-shrink-0 no-print" style={{ height: "calc(100vh - 120px)" }}>
          <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {displayMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-400 italic">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-3 flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* NDA Document — full preview, only this prints */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 nda-document">
            <CoverPage form={form} />
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
