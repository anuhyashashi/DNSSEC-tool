// import { NextResponse } from "next/server"

// export async function POST() {
//   try {
//     // Simulate RSA and ECC performance metrics
//     const results = {
//       rsa: {
//         keySize: 2048,
//         validationTime: 10 + Math.random() * 5, // 10-15ms
//         signatureSize: 256,
//       },
//       ecc: {
//         keySize: 256,
//         validationTime: 2 + Math.random() * 2, // 2-4ms
//         signatureSize: 64,
//       },
//     }

//     return NextResponse.json(results)
//   } catch (error) {
//     console.error("Performance test error:", error)
//     return NextResponse.json({ error: "Failed to run performance test" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST() {
  try {
    const message = "Benchmark Test Message"

    // Generate RSA key pair
    const { publicKey: rsaPublicKey, privateKey: rsaPrivateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    })

    // Generate ECC key pair
    const { publicKey: eccPublicKey, privateKey: eccPrivateKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "P-256",
    })

    // Measure RSA signing and validation time
    const rsaStart = process.hrtime.bigint()
    const rsaSignature = crypto.sign("sha256", Buffer.from(message), rsaPrivateKey)
    const rsaValid = crypto.verify("sha256", Buffer.from(message), rsaPublicKey, rsaSignature)
    const rsaEnd = process.hrtime.bigint()

    // Measure ECC signing and validation time
    const eccStart = process.hrtime.bigint()
    const eccSignature = crypto.sign("sha256", Buffer.from(message), eccPrivateKey)
    const eccValid = crypto.verify("sha256", Buffer.from(message), eccPublicKey, eccSignature)
    const eccEnd = process.hrtime.bigint()

    // Convert time from nanoseconds to milliseconds
    const rsaTime = Number(rsaEnd - rsaStart) / 1e6
    const eccTime = Number(eccEnd - eccStart) / 1e6

    const results = {
      rsa: {
        keySize: 2048,
        validationTime: rsaValid ? rsaTime : null,
        signatureSize: rsaSignature.length,
      },
      ecc: {
        keySize: 256,
        validationTime: eccValid ? eccTime : null,
        signatureSize: eccSignature.length,
      },
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Performance test error:", error)
    return NextResponse.json({ error: "Failed to run performance test" }, { status: 500 })
  }
}
