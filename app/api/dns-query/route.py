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
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId  # Import ObjectId for handling MongoDB IDs

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["dns_security_tool"]
collection = db["dns_query"]

# Helper function to serialize ObjectId
def serialize_record(record):
    # Convert ObjectId to string
    if "_id" in record:
        record["_id"] = str(record["_id"])
    return record

def save_to_mongodb(record):
    # Save the DNSSEC result in MongoDB
    try:
        record["timestamp"] = datetime.utcnow()  # Add timestamp for record creation
        result = collection.insert_one(record)  # Insert the record
        print(f"Record saved: {record}")  # Add print statement for debugging

        # Return saved record with ObjectId converted to string
        saved_record = collection.find_one({"_id": result.inserted_id})
        return serialize_record(saved_record)  # Serialize the ObjectId to string
    except Exception as e:
        print(f"Error saving record: {e}")  # Log error if saving fails
        return {"error": str(e)}

def check_dnssec_and_extra_records(domain):
    try:
        # Check if DNSSEC is enabled by querying DNSKEY record
        dnssec_query = dns.resolver.resolve(domain, "DNSKEY", raise_on_no_answer=False)
        dnssec_enabled = bool(dnssec_query.rrset)

        # Fetch additional records
        a_records = dns.resolver.resolve(domain, "A", raise_on_no_answer=False)
        aaaa_records = dns.resolver.resolve(domain, "AAAA", raise_on_no_answer=False)
        rrsig_records = dns.resolver.resolve(domain, "RRSIG", raise_on_no_answer=False)
        ns_records = dns.resolver.resolve(domain, "NS", raise_on_no_answer=False)
        mx_records = dns.resolver.resolve(domain, "MX", raise_on_no_answer=False)
        txt_records = dns.resolver.resolve(domain, "TXT", raise_on_no_answer=False)

        # Prepare a dictionary of records
        records = {
            "domain": domain,
            "dnssec_enabled": dnssec_enabled,
            "a_records": [str(record) for record in a_records] if a_records else [],
            "aaaa_records": [str(record) for record in aaaa_records] if aaaa_records else [],
            "rrsig_records": [str(record) for record in rrsig_records] if rrsig_records else [],
            "ns_records": [str(record) for record in ns_records] if ns_records else [],
            "mx_records": [str(record) for record in mx_records] if mx_records else [],
            "txt_records": [str(record) for record in txt_records] if txt_records else []
        }

        # Save the result to MongoDB
        saved_result = save_to_mongodb(records)

        # Return the serialized result
        return saved_result
    except Exception as e:
        return {"domain": domain, "error": str(e)}

@app.route("/check-dnssec", methods=["POST"])
def check_dnssec_route():
    data = request.get_json()
    domain = data.get("domain")
    if not domain:
        return jsonify({"error": "No domain provided"}), 400

    result = check_dnssec_and_extra_records(domain)
    return jsonify(result)

@app.route("/get-all-queries", methods=["GET"])
def get_all_queries():
    try:
        # Fetch all records from the collection
        queries = list(collection.find())
        
        # Remove duplicate domains, keeping the first occurrence
        unique_queries = {}
        for query in queries:
            if query['domain'] not in unique_queries:
                unique_queries[query['domain']] = query

        # Serialize each record to handle ObjectId
        serialized_queries = [serialize_record(query) for query in unique_queries.values()]
        
        return jsonify(serialized_queries)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)



