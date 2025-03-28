"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle } from "lucide-react"
import { HomeButton } from "@/components/home-button"

export default function SignatureValidationPage() {
  const [dnskey, setDnskey] = useState("")
  const [rrsig, setRrsig] = useState("")
  const [rrdata, setRrdata] = useState("")
  const [algorithm, setAlgorithm] = useState("ecc") // Default to ECC
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    valid: boolean
    message: string
    timeTaken?: number
  }>(null)

  // Helper function to validate base64 format
  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str
    } catch (e) {
      return false
    }
  }

  // Helper function to validate IP address format
  const isValidIP = (str: string) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return regex.test(str)
  }

  const validateSignature = async () => {
    if (!dnskey || !rrsig || !rrdata) {
      setResult({
        valid: false,
        message: "All fields are required.",
      })
      return
    }

    if (!isBase64(dnskey) || !isBase64(rrsig)) {
      setResult({
        valid: false,
        message: "DNSKEY and RRSIG must be valid base64 strings.",
      })
      return
    }

    if (!isValidIP(rrdata)) {
      setResult({
        valid: false,
        message: "RRDATA must be a valid IP address.",
      })
      return
    }

    console.log("DNSKEY:", dnskey);
    console.log("RRSIG:", rrsig);
    console.log("RRDATA:", rrdata); 
    
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("http://localhost:5001/validate-signature/validate-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dnskey,
          rrsig,
          rrdata,
          algorithm,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({
        valid: false,
        message: "An error occurred during validation. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    if (algorithm === "ecc") {
      setDnskey("mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rAK9iUzy1L53eKGQ==")
      setRrsig("oJB1W6WNGv+ldvQ3WDG0MQkg5IEhjRip8WTrPYGv07h108dUKGMeDPKijVCHX3DDKdfb+v6oB9wfuh3DTJXUAfI=")
      setRrdata("93.184.216.34")
    } else {
      setDnskey("AwEAAagAIKlVZrpC6Ia7gEzahOR+9W29euxhJhVVLOyQbSEW0O8gcCjFFVQUTf6v58fLjwBd0YI0EzrAcQqBGCzh/RStIoO8g0NfnfL2MTJRkxoXbfDaUeVPQuYEhg37NZWAJQ9VnMVDxP/VHL496M/QZxkjf5/Efucp2gaDX6RS6CXpoY68LsvPVjR0ZSwzz1apAzvN9dlzEheX7ICJBBtuA6G3LQpzW5hOA2hzCTMjJPJ8LbqF6dsV6DoBQzgul0sGIcGOYl7OyQdXfZ57relSQageu+ipAdTTJ25AsRTAoub8ONGcLmqrAmRLKBP1dfwhYB4N7knNnulqQxA+Uk1ihz0=")
      setRrsig("UGdJ5BzS2Ky+E2EZhzAGLjXFCQCGXdV7WR5wTFRx+WN9cZtxvCRJGC9tVBQzLFkVWnPQEv5Qzn6Ks3AJiTbLxnDQDMiE+pjnEWdQWex13h1EiwdYtFSiJVl4+nxwIAqDhE5iRC0xCb/xxWy6K/PvWmMLLNzHq/LwsOKWvFfcIzI=")
      setRrdata("93.184.216.34")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-end mb-4">
        <HomeButton />
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>DNSSEC Signature Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ecc" onValueChange={setAlgorithm}>
            <TabsList className="mb-4">
              <TabsTrigger value="ecc">ECC</TabsTrigger>
              <TabsTrigger value="rsa">RSA</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">DNSKEY Record</label>
                <Textarea
                  placeholder="Enter DNSKEY record"
                  value={dnskey}
                  onChange={(e) => setDnskey(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">RRSIG Record</label>
                <Textarea
                  placeholder="Enter RRSIG record"
                  value={rrsig}
                  onChange={(e) => setRrsig(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Signed Data (RRset)</label>
                <Textarea
                  placeholder="Enter the signed data (e.g., A record)"
                  value={rrdata}
                  onChange={(e) => setRrdata(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={validateSignature} disabled={loading || !dnskey || !rrsig || !rrdata}>
                  {loading ? "Validating..." : "Validate"}
                </Button>
                <Button variant="outline" onClick={loadSampleData}>
                  Load Sample
                </Button>
              </div>

              {result && (
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <h3 className={`text-lg font-semibold ${result.valid ? "text-green-600" : "text-red-600"}`}>
                    {result.valid ? "Signature Valid" : "Signature Invalid"}
                  </h3>
                  <p>{result.message}</p>
                  {result.timeTaken && <div className="mt-2">Time: {result.timeTaken.toFixed(2)}ms</div>}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {algorithm === "ecc"
              ? "ECC provides the same security as RSA but with smaller keys."
              : "RSA is the traditional algorithm used in DNSSEC."}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
