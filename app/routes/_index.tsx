import React from "react";
import type { Route } from "./+types/_index";
import { nomLover } from "~/lib/nom-lover";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [name, setName] = React.useState("");

  const nomLoverResult = React.useMemo(() => {
    if (name) {
      return nomLover(name);
    }
    return { score: 0, details: [] };
  }, [name]);

  return (
    <>
      <header className="space-y-4">
        <h1 className="text-6xl">noms are awesome</h1>
        <p className="text-2xl">
          I heavy fw with noms (names) but I love some names more than others,
          enter a name and I'll let you know what I think ✨
        </p>
      </header>
      <main>
        <form className="my-8">
          <input
            type="text"
            placeholder="Enter a name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="border border-gray-300 bg-gray-200 rounded p-2 mt-4 w-full max-w-md"
          />
        </form>

        {name && (
          <div className="mt-8">
            <h2 className="text-3xl mb-4">Results for "{name}"</h2>
            <p className="text-xl">
              Score: <strong>{nomLoverResult.score}</strong>
            </p>
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Score Breakdown:</h3>
              <ul className="space-y-1">
                {nomLoverResult.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <span>
                      <span className="font-medium">{detail.description}</span>
                      <span className="text-gray-600 text-sm ml-2">
                        (position {detail.position})
                      </span>
                    </span>
                    <span
                      className={`font-bold ${detail.score >= 0 ? "text-blue-600" : "text-red-600"}`}
                    >
                      {detail.score >= 0 ? "+" : ""}
                      {detail.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
