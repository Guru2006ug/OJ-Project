import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from "@monaco-editor/react";
import DarkModeToggle from './DarkModeToggle';

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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReview, setAiReview] = useState("");
  const [showAiReview, setShowAiReview] = useState(false);

  // Boilerplate code templates
  const boilerplateCode = {
    cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Your code here
        
        sc.close();
    }
}`,
    py: `# Import necessary libraries
import sys
from collections import defaultdict, deque
from heapq import heappush, heappop

def main():
    # Your code here
    pass

if __name__ == "__main__":
    main()`
  };

  // Function to reset to boilerplate
  const resetToBoilerplate = () => {
    setCode(boilerplateCode[language] || "");
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/api/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  // Set boilerplate code when language changes (only if code is empty)
  useEffect(() => {
    if (!code || code.trim() === "") {
      setCode(boilerplateCode[language] || "");
    }
  }, [language]);

  const runAllTestsAndReturnResults = async () => {
    let finalOutput = "";
    let testOut = "";
    let correct = false;

    // 📥 Run with custom input (if provided)
    if (input.trim()) {
      const customRes = await api.post("/api/compiler", {
        language,
        code,
        input,
      });

      finalOutput += `📥 Custom Input Provided:\nInput:\n${input}\nOutput:\n${customRes.data.output}\n-----------------------------\n\n`;
    }

    // 🧪 Sample visible test case
    if (problem?.sampleInput && problem?.sampleOutput) {
      const res = await api.post("/api/compiler", {
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
        const hiddenRes = await api.post("/api/compiler", {
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
      await api.post(
        "/api/submissions",
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

  const handleAIReview = async () => {
    if (!code.trim()) {
      setAiReview("❌ Please write some code before requesting AI review.");
      setShowAiReview(true);
      return;
    }

    try {
      setAiLoading(true);
      setAiReview("🤖 AI is analyzing your code...");
      setShowAiReview(true);

      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/ai/ai-review",
        { code },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAiReview(response.data.data.review);
    } catch (error) {
      console.error("AI Review failed:", error);
      setAiReview("❌ AI Review failed. Please try again later.");
    } finally {
      setAiLoading(false);
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
                    Code Arena
                  </h1>
                  {problem && (
                    <p className="text-white/80 text-lg">Solve "{problem.title}"</p>
                  )}
                </div>
              </div>
              <p className="text-white/70">Write, compile, and submit your solution</p>
            </div>
            <DarkModeToggle />
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
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <label className="text-base font-semibold text-gray-700 dark:text-gray-300">Your Code</label>
                    </div>
                    <button
                      onClick={resetToBoilerplate}
                      className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/30 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                      title="Reset to boilerplate code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset to Boilerplate
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                    <Editor
                      height="400px"
                      language={language === "py" ? "python" : language}
                      value={code}
                      onChange={(value) => setCode(value)}
                      theme="vs-dark"
                      options={{
                        fontSize: 16,
                        minimap: { enabled: false },
                        scrollbar: {
                          vertical: 'auto',
                          horizontal: 'auto'
                        }
                      }}
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
                    disabled={runLoading || submitLoading || aiLoading}
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
                    disabled={runLoading || submitLoading || aiLoading}
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

                  <button
                    className="flex-1 bg-purple-500/40 backdrop-blur-md border border-purple-400/50 text-purple-100 px-6 py-3 rounded-xl hover:bg-purple-500/60 hover:shadow-glow transform hover:-translate-y-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center gap-3"
                    onClick={handleAIReview}
                    disabled={runLoading || submitLoading || aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-100"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Review
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

          {/* AI Review Section */}
          {showAiReview && (
            <div className="card-modern p-6 text-gray-800 dark:text-white animate-slide-up hover-lift" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-xl border border-purple-400/30">
                    <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      🤖 AI Code Review
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Powered by Google Gemini • Instant feedback on your code
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiReview(false)}
                  className="p-2.5 bg-red-500/20 backdrop-blur-md border border-red-400/40 text-red-400 rounded-xl hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1 transition-all duration-300 group"
                  title="Close AI Review"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-400/30 backdrop-blur-sm shadow-2xl min-h-[250px] max-h-[500px] overflow-y-auto">
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200/30"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-500 absolute inset-0" style={{animationDuration: '1.5s'}}></div>
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300">🧠 AI is analyzing your code...</h4>
                        <p className="text-sm text-purple-600/80 dark:text-purple-400/80">This may take a few seconds</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div className="text-gray-800 dark:text-gray-100 text-sm leading-7">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Custom styling for different markdown elements
                            h1: ({children}) => (
                              <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300 border-b-2 border-purple-200 dark:border-purple-600 pb-2 mb-4 mt-6">
                                {children}
                              </h1>
                            ),
                            h2: ({children}) => (
                              <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300 border-b-2 border-purple-200 dark:border-purple-600 pb-2 mb-4 mt-6">
                                {children}
                              </h2>
                            ),
                            h3: ({children}) => (
                              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 border-b-2 border-purple-200 dark:border-purple-600 pb-2 mb-4 mt-6">
                                {children}
                              </h3>
                            ),
                            p: ({children}) => (
                              <div className="bg-gray-50/50 dark:bg-gray-700/30 rounded-lg p-4 my-3 border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                                  {children}
                                </p>
                              </div>
                            ),
                            ul: ({children}) => (
                              <ul className="space-y-2 my-4">
                                {children}
                              </ul>
                            ),
                            li: ({children}) => (
                              <div className="bg-amber-50/80 dark:bg-amber-900/20 rounded-lg p-4 border-l-4 border-amber-400 shadow-sm">
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="text-gray-700 dark:text-gray-200 font-medium">
                                    {children}
                                  </div>
                                </div>
                              </div>
                            ),
                            ol: ({children}) => (
                              <ol className="space-y-2 my-4">
                                {children}
                              </ol>
                            ),
                            code: ({inline, children}) => {
                              if (inline) {
                                return (
                                  <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono text-purple-600 dark:text-purple-300 border border-gray-300 dark:border-gray-600 shadow-sm">
                                    {children}
                                  </code>
                                );
                              }
                              return (
                                <div className="bg-gray-900 rounded-lg p-4 my-4 border border-gray-600 shadow-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span className="text-gray-400 text-xs font-mono">Code</span>
                                  </div>
                                  <pre className="text-green-400 font-mono text-sm overflow-x-auto leading-relaxed bg-gray-800 rounded p-3 border border-gray-700">
                                    <code>{children}</code>
                                  </pre>
                                </div>
                              );
                            },
                            strong: ({children}) => (
                              <strong className="font-bold text-gray-800 dark:text-gray-100 bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                                {children}
                              </strong>
                            ),
                            em: ({children}) => (
                              <em className="italic text-blue-700 dark:text-blue-300">
                                {children}
                              </em>
                            ),
                            a: ({href, children}) => (
                              <a 
                                href={href} 
                                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors" 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            ),
                            blockquote: ({children}) => (
                              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-4 border-l-4 border-purple-500 my-4 shadow-md">
                                <div className="text-purple-800 dark:text-purple-200">
                                  {children}
                                </div>
                              </div>
                            )
                          }}
                        >
                          {aiReview}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {!aiLoading && aiReview && (
                <div className="mt-6 flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-500/30 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span className="text-sm text-green-700 dark:text-green-300 font-semibold">Review completed successfully</span>
                    </div>
                    <div className="text-xs text-green-600/80 dark:text-green-400/80 bg-green-100/50 dark:bg-green-800/30 px-3 py-1 rounded-full">
                      ✨ Powered by Gemini AI
                    </div>
                  </div>
                  <button
                    onClick={handleAIReview}
                    className="px-5 py-2.5 bg-purple-500/90 hover:bg-purple-600 border border-purple-400/50 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-analyze
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compiler;
