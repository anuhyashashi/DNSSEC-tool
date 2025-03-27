"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { HomeButton } from "@/components/home-button"

export default function PerformancePage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<null | {
    rsa: {
      keySize: number
      validationTime: number
      signatureSize: number
    }
    ecc: {
      keySize: number
      validationTime: number
      signatureSize: number
    }
  }>(null)

  const runPerformanceTest = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/performance-test", {
        method: "POST",
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error running performance test:", error)
    } finally {
      setLoading(false)
    }
  }

  // Simulate performance results for demonstration
  const simulateResults = () => {
    setResults({
      rsa: {
        keySize: 2048,
        validationTime: 12.5,
        signatureSize: 256,
      },
      ecc: {
        keySize: 256,
        validationTime: 3.2,
        signatureSize: 64,
      },
    })
  }

  const getPerformanceData = () => {
    if (!results) return []

    return [
      {
        name: "Validation Time (ms)",
        RSA: results.rsa.validationTime,
        ECC: results.ecc.validationTime,
      },
      {
        name: "Key Size (bytes)",
        RSA: results.rsa.keySize,
        ECC: results.ecc.keySize,
      },
      {
        name: "Signature Size (bytes)",
        RSA: results.rsa.signatureSize,
        ECC: results.ecc.signatureSize,
      },
    ]
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-end mb-4">
        <HomeButton />
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>RSA vs ECC Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="flex justify-center">
              <Button onClick={results ? runPerformanceTest : simulateResults} disabled={loading}>
                {loading ? "Running Test..." : results ? "Run Again" : "Run Test"}
              </Button>
            </div>

            {results && (
              <div className="mt-6">
                <ChartContainer
                  config={{
                    RSA: {
                      label: "RSA",
                      color: "hsl(220, 70%, 50%)",
                    },
                    ECC: {
                      label: "ECC",
                      color: "hsl(150, 70%, 50%)",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getPerformanceData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="RSA" fill="var(--color-RSA)" />
                      <Bar dataKey="ECC" fill="var(--color-ECC)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">RSA (2048-bit)</h3>
                    <ul>
                      <li>Key Size: {results.rsa.keySize} bytes</li>
                      <li>Validation Time: {results.rsa.validationTime.toFixed(2)} ms</li>
                      <li>Signature Size: {results.rsa.signatureSize} bytes</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">ECC (P-256)</h3>
                    <ul>
                      <li>Key Size: {results.ecc.keySize} bytes</li>
                      <li>Validation Time: {results.ecc.validationTime.toFixed(2)} ms</li>
                      <li>Signature Size: {results.ecc.signatureSize} bytes</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            ECC provides better performance with smaller keys and faster validation.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

