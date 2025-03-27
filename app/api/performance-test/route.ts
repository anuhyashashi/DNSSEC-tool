import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Simulate RSA and ECC performance metrics
    const results = {
      rsa: {
        keySize: 2048,
        validationTime: 10 + Math.random() * 5, // 10-15ms
        signatureSize: 256,
      },
      ecc: {
        keySize: 256,
        validationTime: 2 + Math.random() * 2, // 2-4ms
        signatureSize: 64,
      },
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Performance test error:", error)
    return NextResponse.json({ error: "Failed to run performance test" }, { status: 500 })
  }
}

