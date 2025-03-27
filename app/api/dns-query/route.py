# // import { NextResponse } from "next/server"

# // export async function POST(req: Request) {
# //   try {
# //     const { domain } = await req.json()

# //     if (!domain) {
# //       return NextResponse.json({ error: "Domain name is required" }, { status: 400 })
# //     }

# //     // Simulate DNS query with DNSSEC check
# //     const hasDNSSEC = checkDomainHasDNSSEC(domain)

# //     // Simulate DNS records
# //     const records = simulateDNSRecords(domain, hasDNSSEC)

# //     return NextResponse.json({
# //       hasDNSSEC,
# //       records,
# //     })
# //   } catch (error) {
# //     console.error("DNS query error:", error)
# //     return NextResponse.json({ error: "Failed to query DNS records" }, { status: 500 })
# //   }
# // }

# // // Simulate checking if a domain has DNSSEC enabled
# // function checkDomainHasDNSSEC(domain: string): boolean {
# //   // For demo purposes, we'll say some popular domains have DNSSEC
# //   const domainsWithDNSSEC = ["google.com", "cloudflare.com", "ietf.org", "isc.org", "verisign.com"]

# //   return domainsWithDNSSEC.some((d) => domain.includes(d))
# // }

# // // Simulate DNS records
# // function simulateDNSRecords(domain: string, hasDNSSEC: boolean) {
# //   const records: any = {
# //     A: [`93.184.216.${Math.floor(Math.random() * 255)}`],
# //     NS: [`ns1.${domain}`, `ns2.${domain}`],
# //   }

# //   if (hasDNSSEC) {
# //     records.DNSKEY = [
# //       {
# //         flags: 257,
# //         algorithm: 13, // ECDSA with P-256
# //         key: "mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rAK9iUzy1L53eKGQ==",
# //       },
# //     ]
# //     records.RRSIG = [
# //       {
# //         typeCovered: "A",
# //         algorithm: 13,
# //         labels: 2,
# //         originalTTL: 3600,
# //         expiration: Date.now() + 30 * 24 * 60 * 60 * 1000,
# //         inception: Date.now() - 30 * 24 * 60 * 60 * 1000,
# //         keyTag: 12345,
# //         signerName: domain,
# //         signature: "oJB1W6WNGv+ldvQ3WDG0MQkg5IEhjRip8WTrPYGv07h108dUKGMeDPKijVCHX3DDKdfb+v6oB9wfuh3DTJXUAfI=",
# //       },
# //     ]
# //   }

# //   return records
# // }

from flask import Flask, request, jsonify
import dns.resolver
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

def check_dnssec(domain):
    try:
        query = dns.resolver.resolve(domain, "DNSKEY", raise_on_no_answer=False)
        if query.rrset:
            return {"domain": domain, "dnssec_enabled": True}
        else:
            return {"domain": domain, "dnssec_enabled": False}
    except Exception as e:
        return {"domain": domain, "error": str(e)}

@app.route("/check-dnssec", methods=["POST"])
def check_dnssec_route():
    data = request.get_json()
    domain = data.get("domain")
    if not domain:
        return jsonify({"error": "No domain provided"}), 400

    result = check_dnssec(domain)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
