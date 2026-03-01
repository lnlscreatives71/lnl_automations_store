import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 28, 2026</p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                LNL Automations Studio ("we," "us," "our," or "Company") operates the store.lnlautomations.cloud website and related services (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service. Your continued use of our Service following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Information You Provide Directly:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Account information (name, email address, password)</li>
                  <li>Purchase information (billing address, shipping address, payment method)</li>
                  <li>Product reviews and ratings</li>
                  <li>Newsletter subscription preferences</li>
                  <li>Customer support communications</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Information Collected Automatically:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, clicks, searches)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location information (if permitted)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Processing and fulfilling your orders</li>
                <li>Sending order confirmations and updates</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Sending promotional emails and newsletters (with your consent)</li>
                <li>Improving our website and services</li>
                <li>Detecting and preventing fraud and security issues</li>
                <li>Complying with legal obligations</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Personalizing your shopping experience</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Payment Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We process payments through Stripe, a third-party payment processor. We do not store your full credit card information on our servers. Stripe handles all payment processing and PCI DSS compliance. Your payment information is subject to Stripe's Privacy Policy and Terms of Service.
              </p>
              <p>
                For more information about how Stripe handles your data, please visit: <a href="https://stripe.com/privacy" className="text-primary hover:underline">https://stripe.com/privacy</a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our website uses the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                <li><strong>Manus OAuth:</strong> User authentication and account management</li>
                <li><strong>Humanic:</strong> Email delivery and customer communications</li>
              </ul>
              <p>
                These services may collect and process your information according to their own privacy policies. We encourage you to review their privacy policies to understand their practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us remember your preferences and track your activity.
              </p>
              <p>
                Types of cookies we use:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Preference Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
                <li><strong>Marketing Cookies:</strong> Track your activity for targeted advertising</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences. However, disabling cookies may affect website functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Secure database encryption for data at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee confidentiality agreements</li>
              </ul>
              <p>
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Specifically:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Account information: Retained until you delete your account</li>
                <li>Order information: Retained for 7 years for tax and legal compliance</li>
                <li>Marketing communications: Retained until you unsubscribe</li>
                <li>Cookies: Retained according to their expiration dates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications and cookies</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at support@lnlautomations.cloud with your request.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information and terminate the child's account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, and other factors. We will notify you of any material changes by updating the "Last updated" date at the top of this page and, where appropriate, by providing additional notice.
              </p>
              <p>
                Your continued use of our Service following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@lnlautomations.cloud</p>
                <p><strong>Website:</strong> store.lnlautomations.cloud</p>
              </div>
              <p>
                We will respond to your inquiry within 30 days.
              </p>
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
