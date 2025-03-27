// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Shield, ShieldAlert } from "lucide-react"
// import { HomeButton } from "@/components/home-button"

// export default function DNSQueryPage() {
//   const [domain, setDomain] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState<null | {
//     hasDNSSEC: boolean
//     records?: any
//     error?: string
//   }>(null)

//   const checkDomain = async () => {
//     if (!domain) return

//     setLoading(true)
//     setResult(null)

//     try {
//       const response = await fetch("/api/dns-query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ domain }),
//       })

//       const data = await response.json()
//       setResult(data)
//     } catch (error) {
//       setResult({
//         hasDNSSEC: false,
//         error: "Failed to query DNS records. Please try again.",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex justify-end mb-4">
//         <HomeButton />
//       </div>

//       <Card className="max-w-xl mx-auto">
//         <CardHeader>
//           <CardTitle>DNS Query Simulation</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col space-y-4">
//             <div className="flex space-x-2">
//               <Input
//                 placeholder="Enter a domain (e.g., example.com)"
//                 value={domain}
//                 onChange={(e) => setDomain(e.target.value)}
//               />
//               <Button onClick={checkDomain} disabled={loading || !domain}>
//                 {loading ? "Checking..." : "Check"}
//               </Button>
//             </div>

//             {result && (
//               <div className="mt-4">
//                 {result.error ? (
//                   <Alert variant="destructive">
//                     <ShieldAlert className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{result.error}</AlertDescription>
//                   </Alert>
//                 ) : (
//                   <Alert variant={result.hasDNSSEC ? "default" : "destructive"}>
//                     {result.hasDNSSEC ? <Shield className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
//                     <AlertTitle>{result.hasDNSSEC ? "DNSSEC Enabled" : "DNSSEC Not Detected"}</AlertTitle>
//                     <AlertDescription>
//                       {result.hasDNSSEC
//                         ? `${domain} is protected by DNSSEC.`
//                         : `${domain} does not have DNSSEC enabled.`}
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {result.records && (
//                   <div className="mt-4 p-4 bg-muted rounded-md">
//                     <h3 className="font-medium mb-2">DNS Records:</h3>
//                     <pre className="text-xs overflow-auto p-2">{JSON.stringify(result.records, null, 2)}</pre>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </CardContent>
//         <CardFooter>
//           <p className="text-sm text-muted-foreground">This tool checks if a domain has DNSSEC enabled.</p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home } from "lucide-react";

export default function DNSSECChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const checkDNSSEC = async () => {
    setError("");
    setResult(null);
    if (!domain) {
      setError("Please enter a domain name.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/check-dnssec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      {/* Home Button in Top-Right Corner */}
      <Button
        variant="outline"
        className="absolute top-4 right-4 flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        <Home className="w-10 h-10" />
        Home
      </Button>

      <Card className="p-6 w-96 shadow-lg rounded-lg bg-white">
        <CardContent className="flex flex-col gap-4 text-center">
          <h2 className="text-xl font-semibold">DNSSEC Checker</h2>
          <Input
            type="text"
            placeholder="Enter domain (e.g., example.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="text-center"
          />
          <Button onClick={checkDNSSEC} className="w-full">
            Check DNSSEC
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {result && (
            <p>
              DNSSEC for <strong>{result.domain}</strong>:{" "}
              {result.dnssec_enabled ? (
                <span className="text-green-500">Enabled ✅</span>
              ) : (
                <span className="text-red-500">Not Enabled ❌</span>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
