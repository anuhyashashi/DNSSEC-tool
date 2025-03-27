// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Shield, Search, FileSignature, BarChart3 } from "lucide-react"

// export default function Home() {
//   return (
//     <div className="container mx-auto py-8">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">DNS Security Tool</h1>
//         <p className="mt-2 text-muted-foreground">ECC for DNSSEC validation</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Search className="h-5 w-5" />
//               <CardTitle>DNS Query</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p>Check if a domain has DNSSEC enabled</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/dns-query" className="w-full">
//               <Button className="w-full">Check Domain</Button>
//             </Link>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <FileSignature className="h-5 w-5" />
//               <CardTitle>Signature Validation</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p>Validate DNSSEC signatures with RSA and ECC</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/signature-validation" className="w-full">
//               <Button className="w-full">Validate</Button>
//             </Link>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <BarChart3 className="h-5 w-5" />
//               <CardTitle>Performance</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p>Compare RSA vs ECC performance</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/performance" className="w-full">
//               <Button className="w-full">Compare</Button>
//             </Link>
//           </CardFooter>
//         </Card>

//         {/* <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               <CardTitle>Security Insights</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p>Learn about DNS security and ECC benefits</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/security-insights" className="w-full">
//               <Button className="w-full">Learn More</Button>
//             </Link>
//           </CardFooter>
//         </Card> */}
//       </div>
//     </div>
//   )
// }

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileSignature, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-8">

      <div className="bg-background p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold">DEPARTMENT OF INFORMATION TECHNOLOGY</h1>
        <h2 className="text-lg font-semibold">NATIONAL INSTITUTE OF TECHNOLOGY KARNATAKA, SURATHKAL-575025</h2>
        
        <p className="mt-4 font-semibold">Information Assurance and Security (IT352) Course Project</p>
        <p className="italic font-medium">Title “DNS Security Tool”</p>

        <p className="mt-4 font-semibold">Carried out by</p>
        <p>Anuhya Shashi (221IT010)</p>
        <p>Bhoomika Deep Mahawar (221IT018)</p>
        <p className="mt-2">During Academic Session January – April 2025</p>

      </div>

      {/* Spacer */}
      
      <div className="my-10 border-b"></div>
      <br></br><br></br>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">DNS Security Tool</h1>
        <p className="mt-2 text-muted-foreground">ECC for DNSSEC validation</p>
      </div>

      {/* Horizontal arrangement using flex */}
      <div className="flex flex-wrap justify-center gap-4">
        <Card className="w-80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <CardTitle>DNS Query</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Check if a domain has DNSSEC enabled</p>
          </CardContent>
          <CardFooter>
            <Link href="/dns-query" className="w-full">
              <Button className="w-full">Check Domain</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              <CardTitle>Signature Validation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Validate DNSSEC signatures with RSA and ECC</p>
          </CardContent>
          <CardFooter>
            <Link href="/signature-validation" className="w-full">
              <Button className="w-full">Validate</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Compare RSA vs ECC performance</p>
          </CardContent>
          <CardFooter>
            <Link href="/performance" className="w-full">
              <Button className="w-full">Compare</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
