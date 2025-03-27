import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { dnskey, rrsig, rrdata, algorithm } = await req.json()

    if (!dnskey || !rrsig || !rrdata) {
      return NextResponse.json({ error: "DNSKEY, RRSIG, and RRdata are required" }, { status: 400 })
    }

    // Simulate validation time (ECC is faster than RSA)
    const startTime = performance.now()

    // Simulate processing time difference between RSA and ECC
    await new Promise((resolve) => setTimeout(resolve, algorithm === "ecc" ? 50 : 200))

    // Simulate validation result
    const isValid = simulateSignatureValidation(dnskey, rrsig, rrdata, algorithm)

    const endTime = performance.now()
    const timeTaken = endTime - startTime

    if (isValid) {
      return NextResponse.json({
        valid: true,
        message: `The DNSSEC signature is valid.`,
        timeTaken,
      })
    } else {
      return NextResponse.json({
        valid: false,
        message: "The DNSSEC signature is invalid. The signature does not match the DNS data or the DNSKEY.",
        timeTaken,
      })
    }
  } catch (error) {
    console.error("Signature validation error:", error)
    return NextResponse.json({ error: "Failed to validate signature" }, { status: 500 })
  }
}

// Simulate DNSSEC signature validation
function simulateSignatureValidation(dnskey: string, rrsig: string, rrdata: string, algorithm: string): boolean {
  // For demo purposes, we'll validate based on some simple checks

  // Check if the records appear to be in the correct format
  const dnskeyValid = dnskey.includes("DNSKEY") && (algorithm === "ecc" ? dnskey.includes("13") : dnskey.includes("8"))

  const rrsigValid = rrsig.includes("RRSIG") && (algorithm === "ecc" ? rrsig.includes("13") : rrsig.includes("8"))

  const rrdataValid =
    rrdata.includes("IN") && (rrdata.includes("A") || rrdata.includes("AAAA") || rrdata.includes("MX"))

  // Check if the domain names match across records
  const getDomain = (record: string) => {
    const parts = record.split(" ")
    return parts[0]
  }

  const domainMatch = getDomain(dnskey) === getDomain(rrsig) && getDomain(rrsig) === getDomain(rrdata)

  // For demo purposes, return true if everything looks valid
  return dnskeyValid && rrsigValid && rrdataValid && domainMatch
}

