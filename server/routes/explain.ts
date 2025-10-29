import { RequestHandler } from "express";
import OpenAI from "openai";
import { ExplainCodeRequest, ExplainCodeResponse } from "@shared/api";

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
let initializationAttempted = false;

function initializeOpenAI() {
  if (initializationAttempted) {
    return openai;
  }
  
  initializationAttempted = true;
  
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here") {
    try {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log("✅ OpenAI client initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize OpenAI client:", error);
      openai = null;
    }
  } else {
    console.log("⚠️ OpenAI API key not configured, using fallback analysis");
  }
  
  return openai;
}

/**
 * Handles code explanation requests using OpenAI GPT
 */
export const handleExplainCode: RequestHandler = async (req, res) => {
  try {
    const { code }: ExplainCodeRequest = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Code is required" });
    }

    // Initialize OpenAI client if not already done
    const openaiClient = initializeOpenAI();
    
    // Check if OpenAI client is available
    if (!openaiClient) {
      console.warn("OpenAI API key not configured, falling back to local analysis");
      return res.status(200).json(await fallbackAnalysis(code));
    }

    // Use OpenAI to explain the code
    const explanations = await explainCodeWithOpenAI(code);

    const response: ExplainCodeResponse = {
      explanations
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error explaining code:", error);
    
    // Fallback to local analysis if OpenAI fails
    try {
      const fallbackResponse = await fallbackAnalysis(req.body.code);
      return res.status(200).json(fallbackResponse);
    } catch (fallbackError) {
      console.error("Fallback analysis also failed:", fallbackError);
      res.status(500).json({ error: "Failed to explain code" });
    }
  }
};

/**
 * Explains code using OpenAI GPT-4
 */
async function explainCodeWithOpenAI(code: string): Promise<ExplainCodeResponse['explanations']> {
  const openaiClient = initializeOpenAI();
  if (!openaiClient) {
    throw new Error("OpenAI client not initialized");
  }
  
  try {
    const prompt = `You are a Universal Code Explainer. Analyze the following code and provide a line-by-line explanation.

IMPORTANT: Detect the programming language automatically and adapt your explanation accordingly.

For each non-empty line, provide:
1. The line number
2. The exact code
3. A clear, educational explanation of what the line does and why it's important

Focus on:
- Language-specific concepts and patterns
- Framework-specific features (if applicable)
- Code structure and flow
- Best practices for that language
- Common pitfalls and gotchas
- Performance considerations

Code to analyze:
\`\`\`
${code}
\`\`\`

Return your response as a JSON array where each object has:
- lineNumber: number
- code: string (exact line)
- explanation: string (clear explanation)

Skip empty lines. Be educational and help developers understand both the "what" and "why". Make explanations beginner-friendly but comprehensive.`;

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a Universal Code Explainer who can analyze and explain code in any programming language (JavaScript, Python, Java, C#, C++, Go, Rust, SQL, HTML/CSS, etc.). Always return valid JSON. Adapt your explanations to the specific language and framework being used."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const explanations = JSON.parse(response);
    
    // Validate the response format
    if (!Array.isArray(explanations)) {
      throw new Error("Invalid response format from OpenAI");
    }

    return explanations;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

/**
 * Fallback analysis using local pattern matching
 */
async function fallbackAnalysis(code: string): Promise<ExplainCodeResponse> {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  
  // Filter out blank lines and process each line
  const explanations = [];
  let lineNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip blank lines
    if (!trimmed) {
      lineNumber++;
      continue;
    }

    // Generate explanation using local analysis
    const explanation = await generateExplanation(trimmed, i, lines);
    
    explanations.push({
      lineNumber,
      code: line,
      explanation
    });
    
    lineNumber++;
  }

  return { explanations };
}

/**
 * Generates explanation for a line of code using local pattern analysis
 * This is used as a fallback when OpenAI is not available
 */
async function generateExplanation(line: string, index: number, allLines: string[]): Promise<string> {
  const trimmed = line.trim();

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Enhanced pattern matching for better explanations
  if (/^\/\//.test(trimmed)) {
    return "This is a comment that documents the code for human developers. Comments help explain the 'why' behind the code logic.";
  }

  if (/^\/\*/.test(trimmed)) {
    return "This starts a multi-line comment block. These comments can span multiple lines and are useful for detailed documentation.";
  }

  if (/^import\s+/.test(trimmed)) {
    const importMatch = trimmed.match(/^import\s+(.*)\s+from\s+["'`](.*)["'`]/);
    if (importMatch) {
      return `Imports ${importMatch[1].trim()} from the module "${importMatch[2]}". This makes the imported functionality available for use in this file.`;
    }
    return "Imports external dependencies needed in this file. Import statements must come before other code.";
  }

  if (/^export\s+function\s+/.test(trimmed)) {
    const nameMatch = trimmed.match(/^export\s+function\s+([^(\s]+)/);
    if (nameMatch) {
      return `Exports a function component named ${nameMatch[1]}, making it available to other files that import this module. This is a common pattern in React applications.`;
    }
    return "Exports a function so it can be imported and used in other files. This enables code reusability across your application.";
  }

  if (/^function\s+/.test(trimmed)) {
    const nameMatch = trimmed.match(/^function\s+([^(\s]+)/);
    if (nameMatch) {
      return `Defines a function called ${nameMatch[1]} that can be called later. Functions encapsulate reusable logic and help organize code.`;
    }
    return "Defines a function that groups related code together. Functions help make code more organized and reusable.";
  }

  if (/^const\s+\[.*\]\s*=\s*useState\(/.test(trimmed)) {
    const stateMatch = trimmed.match(/^const\s+\[([^,]+),\s*([^\]]+)\]/);
    if (stateMatch) {
      return `Creates a React state variable ${stateMatch[1].trim()} and its setter function ${stateMatch[2].trim()} using the useState hook. State allows components to store and update data that triggers re-renders when changed.`;
    }
    return "Initializes React state using the useState hook. State is essential for creating interactive components that can change over time.";
  }

  if (/^const\s+\{.*\}\s*=\s*props/.test(trimmed)) {
    return "Destructures specific properties from the props object. This is a common pattern that makes props easier to use by extracting only the values you need.";
  }

  if (/^const\s+/.test(trimmed) || /^let\s+/.test(trimmed) || /^var\s+/.test(trimmed)) {
    const variableMatch = trimmed.match(/^(const|let|var)\s+([^{=\s]+)/);
    if (variableMatch) {
      return `Declares a ${variableMatch[1]} variable named ${variableMatch[2]}. ${variableMatch[1] === 'const' ? 'const' : variableMatch[1] === 'let' ? 'let' : 'var'} determines the variable's scope and reassignment behavior.`;
    }
    return "Declares a variable to store a value. Variables are fundamental building blocks for storing and manipulating data.";
  }

  if (trimmed.includes("useEffect(")) {
    return "Sets up a React effect hook to perform side effects after the component renders. Effects are perfect for API calls, subscriptions, or DOM manipulation.";
  }

  if (trimmed.includes("useMemo(")) {
    return "Uses the useMemo hook to memoize an expensive calculation. This optimization prevents unnecessary recalculations when dependencies haven't changed.";
  }

  if (trimmed.includes("useCallback(")) {
    return "Uses the useCallback hook to memoize a function. This prevents the function from being recreated on every render, which can help with performance optimization.";
  }

  if (/props\./.test(trimmed)) {
    return "Accesses data from the component's props. Props are how parent components pass data down to child components in React.";
  }

  if (trimmed.startsWith("return (") || trimmed === "return") {
    return "Begins the JSX return statement that defines what the component will render. JSX allows you to write HTML-like syntax in JavaScript.";
  }

  if (trimmed === "return null;") {
    return "Returns null to render nothing from this component. This is useful for conditional rendering when you want to hide the component completely.";
  }

  if (/=>\s*\{?$/.test(trimmed)) {
    return "Defines an arrow function, commonly used for event handlers, callbacks, or inline functions. Arrow functions have a more concise syntax than regular functions.";
  }

  if (/^if\s*\(/.test(trimmed)) {
    return "Starts a conditional statement that executes code only when the specified condition is true. Conditionals are essential for creating dynamic, responsive applications.";
  }

  if (/^for\s*\(/.test(trimmed)) {
    return "Begins a for loop that repeats code multiple times. Loops are powerful tools for processing arrays, objects, or any collection of data.";
  }

  if (/useRef\(/.test(trimmed)) {
    return "Creates a React ref that provides direct access to DOM elements or stores mutable values that persist between renders without causing re-renders.";
  }

  if (/map\(/.test(trimmed) && /=>/.test(trimmed)) {
    return "Uses the map function to transform each item in an array into JSX elements. This is the standard React pattern for rendering lists of data.";
  }

  if (/className=/.test(trimmed) || /^<\w+/.test(trimmed)) {
    return "Defines JSX elements that will be rendered to the DOM. JSX combines the power of JavaScript with the familiarity of HTML syntax.";
  }

  if (/^\)/.test(trimmed)) {
    if (allLines[index - 1]?.trim().startsWith("return")) {
      return "Closes the JSX return statement. This completes the component's render output.";
    }
    return "Closes a grouped expression or function call. Parentheses help organize complex expressions and function arguments.";
  }

  if (/^\}/.test(trimmed)) {
    if (allLines[index - 1]?.includes("return")) {
      return "Closes the component or function definition. This marks the end of the component's logic and structure.";
    }
    return "Closes a code block, function, or object. Braces define the scope and boundaries of different code sections.";
  }

  if (/set[A-Z]/.test(trimmed) && /\(.*\)/.test(trimmed)) {
    return "Calls a state setter function to update component state. When state changes, React automatically re-renders the component to reflect the new values.";
  }

  if (trimmed === "};" || trimmed === "});") {
    return "Closes a function or object definition. This completes the definition and makes it available for use.";
  }

  if (/^return\s+/.test(trimmed)) {
    return "Returns a value from the current function. Return statements specify what the function produces when called.";
  }

  return "Executes this statement as part of the component's logic. This line contributes to the overall functionality and behavior of the code.";
}
