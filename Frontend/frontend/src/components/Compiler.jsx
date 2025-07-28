import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Compiler = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setOutput("Compiling...");
      let finalOutput = "";
  
      // ✍️ Custom input execution
      if (input.trim()) {
        const customRes = await axios.post("http://localhost:5000/api/compiler", {
          language,
          code,
          input: input,
        });
  
        finalOutput += `📥 Custom Input Provided:\n`;
        finalOutput += `Input:\n${input}\n`;
        finalOutput += `Output:\n${customRes.data.output}\n`;
        finalOutput += `-----------------------------\n\n`;
      }
  
      // 🧪 Sample visible test case
      const hasSample = problem?.sampleInput && problem?.sampleOutput;
      if (hasSample) {
        const res = await axios.post("http://localhost:5000/api/compiler", {
          language,
          code,
          input: problem.sampleInput,
          expectedOutput: problem.sampleOutput,
        });
  
        const { output: testOut, correct } = res.data;
  
        finalOutput += `🧪 Sample Test Case:\n`;
        finalOutput += `Input:\n${problem.sampleInput}\n`;
        finalOutput += `Output:\n${testOut}\n`;
        finalOutput += `Expected:\n${problem.sampleOutput}\n`;
        finalOutput += `Result: ${correct ? "✅ Passed" : "❌ Failed"}\n`;
        finalOutput += `-----------------------------\n\n`;
      } else {
        finalOutput += `⚠️ No visible (sample) test case provided.\n\n`;
      }
  
      // 🕵️ Hidden test cases
      if (problem?.hiddenTestCases?.length) {
        let allHiddenPassed = true;
  
        for (const testCase of problem.hiddenTestCases) {
          const hiddenRes = await axios.post("http://localhost:5000/api/compiler", {
            language,
            code,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
          });
  
          if (!hiddenRes.data.correct) {
            allHiddenPassed = false;
            break;
          }
        }
  
        finalOutput += allHiddenPassed
          ? "✅ All hidden test cases passed"
          : "❌ Failed on one or more hidden test cases";
      }
  
      setOutput(finalOutput.trim());
    } catch (err) {
      let errorMsg = err.response?.data?.error || err.message || "Something went wrong.";
  
      const isSyntaxError = typeof errorMsg === "string" && (
        errorMsg.toLowerCase().includes("error") ||
        errorMsg.toLowerCase().includes("syntax") ||
        errorMsg.toLowerCase().includes("compilation") ||
        errorMsg.toLowerCase().includes("expected")
      );
  
      if (isSyntaxError) {
        setOutput("❌ Error: There is a syntax error in your program.");
      } else {
        setOutput(typeof errorMsg === "string" ? errorMsg : "⚠️ An unexpected error occurred.");
      }
    } finally {
      setLoading(false);  // ✅ Fix: Re-enable "Run Code" button
    }
  };
  
  
  
  

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Online Judge</h2>

      {problem ? (
        <div className="bg-white shadow p-4 rounded border mb-6">
          <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
          <p className="mb-2">{problem.description}</p>
          <p className="mb-1 font-semibold">Input Format:</p>
          <p className="mb-2">{problem.inputFormat}</p>
          <p className="mb-1 font-semibold">Output Format:</p>
          <p className="mb-2">{problem.outputFormat}</p>
          <p className="mb-1 font-semibold">Constraints:</p>
          <p className="mb-2">{problem.constraints}</p>
          <p className="mb-1 font-semibold">Sample Input:</p>
          <pre className="bg-gray-100 p-2 rounded mb-2">{problem.sampleInput}</pre>
          <p className="mb-1 font-semibold">Sample Output:</p>
          <pre className="bg-gray-100 p-2 rounded">{problem.sampleOutput}</pre>
        </div>
      ) : (
        <p>Loading problem...</p>
      )}

      <label className="block mb-2 font-semibold">Language:</label>
      <select
        className="mb-4 p-2 border rounded w-full"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="py">Python</option>
      </select>

      <label className="block mb-2 font-semibold">Code:</label>
      <textarea
        className="w-full h-64 border p-2 font-mono mb-4 rounded"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Write your code here"
      />

      <label className="block mb-2 font-semibold">Input (optional):</label>
      <textarea
        className="w-full h-24 border p-2 font-mono mb-4 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter custom input here"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      <div className="mt-6">
        <label className="block mb-2 font-semibold">Output:</label>
        <pre className="bg-gray-100 p-4 rounded border whitespace-pre-wrap text-sm">
          {output || "Your output will appear here..."}
        </pre>
      </div>
    </div>
  );
};

export default Compiler;
