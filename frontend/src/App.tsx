
import { Button } from "./components/ui/button";
import axios from "axios";
import "./index.css";
import { useRef, useState } from "react";

const BACKEND_URL = "http://localhost:3000";

export function App() {
  const codeRef = useRef(null as HTMLTextAreaElement | null);
  const [status, setStatus] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");

  async function pollBackend(submissionId: string) {
    const response = await axios.get(`${BACKEND_URL}/submition/${submissionId}`);
    if(response.data.status !== "Processing") {
      setStatus(response.data.status);
      setOutput(response.data.output);
    } else {
      setTimeout(() => pollBackend(submissionId), 2000); 
    }
  }

  return (
    <div className="flex h-screen w-screen">

      <div className="flex-1 h-screen bg-mist-400  p-4 overflow-scroll">
        <div>
          <Button variant={language === "ts" ? "destructive" : "outline"} onClick={() => setLanguage("ts")}>
            TS
          </Button>
          <Button variant={language === "js" ? "destructive" : "outline"} onClick={() => setLanguage("js")}>
            JS
          </Button>
          <Button variant={language === "py" ? "destructive" : "outline"} onClick={() => setLanguage("py")}>
            PYTHON
          </Button>
          <Button variant={language === "cpp" ? "destructive" : "outline"} onClick={() => setLanguage("cpp")}>
            C++
          </Button>
        </div>
        <textarea ref={codeRef} className="w-full h-full border-2 rounded-2xl p-2 " placeholder="code" />
      </div>

      <div className="flex-1 h-screen bg-mauve-400 p-4 overflow-scroll">
        <div>
          <Button variant="outline"
            onClick={async () => {
              setStatus("Processing...");
              setOutput("");
              const response = await axios.post(`${BACKEND_URL}/submition`, {
                language: language,
                code: codeRef.current!.value
              })
              pollBackend(response.data.submissionId);
            }}
          >
            Run:
          </Button>
        </div>
        <div className="whitespace-pre-wrap p-2 m-3 border-s-2 rounded-3xl border-accent-foreground">{status}</div>
        <div className="whitespace-pre-wrap p-2 m-2 border-2 rounded-3xl border-accent-foreground">{output}</div>
      </div>
    </div>
    
  );
}

export default App;
