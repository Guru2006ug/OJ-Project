import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Compiler = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const runAllTestsAndReturnResults = async () => {
    let finalOutput = "";
    let testOut = "";
    let correct = false;

    // 📥 Run with custom input (if provided)
    if (input.trim()) {
      const customRes = await axios.post("http://localhost:5000/api/compiler", {
        language,
        code,
        input,
      });

      finalOutput += `📥 Custom Input Provided:\nInput:\n${input}\nOutput:\n${customRes.data.output}\n-----------------------------\n\n`;
    }

    // 🧪 Sample visible test case
    if (problem?.sampleInput && problem?.sampleOutput) {
      const res = await axios.post("http://localhost:5000/api/compiler", {
        language,
        code,
        input: problem.sampleInput,
        expectedOutput: problem.sampleOutput,
      });

      testOut = res.data.output;
      correct = res.data.correct;

      finalOutput += `🧪 Sample Test Case:\nInput:\n${problem.sampleInput}\nOutput:\n${testOut}\nExpected:\n${problem.sampleOutput}\nResult: ${correct ? "✅ Passed" : "❌ Failed"}\n-----------------------------\n\n`;
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

    return { finalOutput, testOut, correct };
  };

  const handleRun = async () => {
    try {
      setRunLoading(true);
      setOutput("Compiling...");
      const { finalOutput } = await runAllTestsAndReturnResults();
      setOutput(finalOutput.trim());
    } catch (err) {
      handleCompilerError(err);
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      setOutput("Submitting...");
      const { finalOutput, testOut, correct } = await runAllTestsAndReturnResults();

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/submissions",
        {
          problemId: id,
          code,
          language,
          input: problem.sampleInput,
          output: testOut,
          expectedOutput: problem.sampleOutput,
          isPassed: correct,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOutput(finalOutput.trim() + `\n\n📩 Submission saved.`);
    } catch (err) {
      handleCompilerError(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCompilerError = (err) => {
    let errorMsg = err.response?.data?.error || err.message || "Something went wrong.";
    const isSyntaxError =
      typeof errorMsg === "string" &&
      (errorMsg.toLowerCase().includes("error") ||
        errorMsg.toLowerCase().includes("syntax") ||
        errorMsg.toLowerCase().includes("compilation") ||
        errorMsg.toLowerCase().includes("expected"));

    if (isSyntaxError) {
      setOutput("❌ Error: There is a syntax error in your program.");
    } else {
      setOutput(typeof errorMsg === "string" ? errorMsg : "⚠️ An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-dark-gradient text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl float-delayed"></div>
      </div>

      <div className="relative z-10 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <div className="animate-slide-up">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-xl hover:bg-white/20 hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                    Code Editor
                  </h1>
                  {problem && (
                    <p className="text-white/80 text-lg">Solve "{problem.title}"</p>
                  )}
                </div>
              </div>
              <p className="text-white/70">Write, compile, and submit your solution</p>
            </div>
          </div>

          {problem ? (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
              {/* Problem Statement - Takes 2 columns */}
              <div className="xl:col-span-2 card-modern p-5 text-gray-800 dark:text-white animate-slide-up hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">{problem.title}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{problem.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Input Format</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{problem.inputFormat}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Output Format</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{problem.outputFormat}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Constraints</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{problem.constraints}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Sample Input</h4>
                      <div className="bg-gray-900 rounded-lg p-3">
                        <pre className="text-green-400 text-xs font-mono leading-relaxed">{problem.sampleInput}</pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Sample Output</h4>
                      <div className="bg-gray-900 rounded-lg p-3">
                        <pre className="text-blue-400 text-xs font-mono leading-relaxed">{problem.sampleOutput}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Editor Section - Takes 3 columns */}
              <div className="xl:col-span-3 space-y-5">
                {/* Language Selection */}
                <div className="card-modern p-4 text-gray-800 dark:text-white animate-slide-up hover-lift" style={{animationDelay: '0.1s'}}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300">Programming Language</label>
                  </div>
                  <select
                    className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all appearance-none"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="cpp" className="bg-gray-800 text-white py-2 px-3 hover:bg-gray-700">C++</option>
                    <option value="java" className="bg-gray-800 text-white py-2 px-3 hover:bg-gray-700">Java</option>
                    <option value="py" className="bg-gray-800 text-white py-2 px-3 hover:bg-gray-700">Python</option>
                  </select>
                </div>

                {/* Code Editor - Maximum space allocated */}
                <div className="card-modern p-4 text-gray-800 dark:text-white animate-slide-up hover-lift" style={{animationDelay: '0.2s'}}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-green-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300">Your Code</label>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                    <textarea
                      className="w-full h-96 bg-transparent text-green-400 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-500"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="// Write your code here..."
                    />
                  </div>
                </div>

                {/* Custom Input - Compact */}
                <div className="card-modern p-4 text-gray-800 dark:text-white animate-slide-up hover-lift" style={{animationDelay: '0.3s'}}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-orange-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300">Custom Input (Optional)</label>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-3 border border-gray-700">
                    <textarea
                      className="w-full h-20 bg-transparent text-yellow-400 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-500"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter custom input here..."
                    />
                  </div>
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <button
                    className="flex-1 bg-blue-500/40 backdrop-blur-md border border-blue-400/50 text-blue-100 px-6 py-3 rounded-xl hover:bg-blue-500/60 hover:shadow-glow transform hover:-translate-y-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center gap-3"
                    onClick={handleRun}
                    disabled={runLoading || submitLoading}
                  >
                    {runLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-100"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Run Code
                      </>
                    )}
                  </button>

                  <button
                    className="flex-1 bg-green-500/40 backdrop-blur-md border border-green-400/50 text-green-100 px-6 py-3 rounded-xl hover:bg-green-500/60 hover:shadow-glow transform hover:-translate-y-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center gap-3"
                    onClick={handleSubmit}
                    disabled={runLoading || submitLoading}
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-100"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <h3 className="text-xl font-semibold text-white/80">Loading problem...</h3>
            </div>
          )}

          {/* Output Section */}
          <div className="card-modern p-5 text-gray-800 dark:text-white animate-slide-up hover-lift" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Output</h3>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 min-h-[180px] max-h-[300px] overflow-y-auto">
              <pre className="text-cyan-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {output || "Your output will appear here..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
