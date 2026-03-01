import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a href="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="LNL Automations" className="h-16 w-auto" />
                <span className="font-bold text-xl">LNL Automations</span>
              </a>
            </Link>
            <Link href="/products">
              <a>
                <Button>Browse Products</Button>
              </a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 28, 2026</p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and LNL Automations Studio ("Company," "we," "us," or "our"). By accessing and using the store.lnlautomations.cloud website and services (the "Service"), you agree to be bound by these Terms.
              </p>
              <p>
                If you do not agree to abide by the above, please do not use this Service. We reserve the right to modify these Terms at any time. Your continued use of the Service following any such modification constitutes your acceptance of the modified Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on LNL Automations Studio's Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The materials on LNL Automations Studio's Service are provided on an 'as is' basis. LNL Automations Studio makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p>
                Further, LNL Automations Studio does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Service or otherwise relating to such materials or on any sites linked to this Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In no event shall LNL Automations Studio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LNL Automations Studio's Service, even if LNL Automations Studio or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
              <p>
                Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Accuracy of Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The materials appearing on LNL Automations Studio's Service could include technical, typographical, or photographic errors. LNL Automations Studio does not warrant that any of the materials on its Service are accurate, complete, or current. LNL Automations Studio may make changes to the materials contained on its Service at any time without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                LNL Automations Studio has not reviewed all of the sites linked to its Service and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LNL Automations Studio of the site. Use of any such linked website is at the user's own risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                LNL Automations Studio may revise these Terms of Service for its Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these Terms of Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                These Terms and Conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When you create an account on our Service, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the confidentiality of your password and account information</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Not use another person's account without permission</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Harassing, threatening, intimidating, or abusing any person</li>
                <li>Posting content that is defamatory, obscene, or otherwise objectionable</li>
                <li>Attempting to gain unauthorized access to our systems or networks</li>
                <li>Interfering with or disrupting the Service or servers</li>
                <li>Uploading or transmitting viruses or malicious code</li>
                <li>Engaging in any form of fraud or deception</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Reselling or redistributing products without authorization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Product Information and Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content on our Service is accurate, complete, or error-free. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Correct any errors in pricing or product information</li>
                <li>Cancel orders that contain pricing errors</li>
                <li>Refuse or cancel any order at our discretion</li>
                <li>Limit quantities of products available for purchase</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Payment and Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By placing an order, you agree to pay all charges associated with your purchase, including applicable taxes and shipping fees. Payment is processed through Stripe, a third-party payment processor. By providing payment information, you authorize us to charge your payment method for the purchase.
              </p>
              <p>
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate billing information</li>
                <li>Notify us of any changes to your billing information</li>
                <li>Pay all charges incurred by authorized users of your account</li>
                <li>Comply with all applicable laws regarding payment</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We will use reasonable efforts to deliver physical products to the address you provide. However, we are not responsible for delays caused by shipping carriers, weather, or other circumstances beyond our control. Risk of loss for physical products transfers to you upon delivery to the shipping carrier.
              </p>
              <p>
                Digital products are delivered immediately upon purchase completion. You acknowledge that digital products cannot be returned or refunded once delivered.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Refunds and Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Please refer to our Refund Policy for detailed information regarding returns and refunds. In general:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Physical products may be returned within 30 days of purchase</li>
                <li>Digital products are non-refundable once delivered</li>
                <li>Refunds are processed within 5-7 business days</li>
                <li>Shipping costs are non-refundable</li>
              </ul>
              <p>
                For more details, please visit our <Link href="/refund-policy"><a className="text-primary hover:underline">Refund Policy</a></Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>15. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All content on our Service, including text, graphics, logos, images, and software, is the property of LNL Automations Studio or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or transmit any content without our prior written permission.
              </p>
              <p>
                Digital products you purchase are licensed for personal use only. You may not resell, redistribute, or share digital products with others.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>16. User-Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Any content you submit to our Service, including reviews and comments, may be used by us in any manner we deem appropriate, including displaying it on our website or in marketing materials. By submitting content, you grant us a non-exclusive, royalty-free, perpetual license to use, modify, and distribute your content.
              </p>
              <p>
                You represent and warrant that you own or have the necessary rights to the content you submit and that your content does not violate any third-party rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>17. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL LNL AUTOMATIONS STUDIO, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>18. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You agree to indemnify, defend, and hold harmless LNL Automations Studio and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorney's fees) arising out of or related to your use of the Service or violation of these Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>19. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may terminate or suspend your account and access to the Service at any time, without notice or liability, for any reason, including if you violate these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>20. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@lnlautomations.cloud</p>
                <p><strong>Website:</strong> store.lnlautomations.cloud</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/">
            <a>
              <Button variant="outline">Back to Home</Button>
            </a>
          </Link>
          <Link href="/contact">
            <a>
              <Button>Contact Support</Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
