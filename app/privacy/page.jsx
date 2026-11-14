export const metadata = {
  title: "Privacy Policy | Use All Tools",
  description: "Learn about how Use All Tools protects your privacy and handles your data",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="lead text-lg mb-6">
          Last updated: 2026
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment to Privacy</h2>
          <p>
            At Use All Tools, we take your privacy seriously. Our tools are designed to respect your privacy and operate without collecting or storing your personal data.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Don't Collect</h2>
          <p>
            Our tools operate entirely on your device. We do not:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Collect personal information</li>
            <li>Track your usage or behavior</li>
            <li>Store your calculations or inputs</li>
            <li>Share any data with third parties</li>
            <li>Use cookies for tracking purposes</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Client-Side Processing</h2>
          <p>
            All of our calculators, converters, and other tools process information locally in your browser. Data you input is not transmitted to our servers or stored anywhere outside your device.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Technical Information</h2>
          <p>
            Our website may receive standard, non-identifying technical information through CDN and hosting infrastructure, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Anonymous usage metrics</li>
            <li>Browser type and version</li>
            <li>Operating system information</li>
            <li>Referring/exit pages</li>
          </ul>
          <p className="mt-4">
            This information is used solely to maintain website performance and reliability. It cannot be used to identify you personally.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          <p>
            Our website may use third-party infrastructure services such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Hosting providers</li>
            <li>Content delivery networks</li>
          </ul>
          <p className="mt-4">
            These services may handle standard network requests as described above, but have zero access to calculation inputs or figures entered into our tools.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13, and we do not knowingly collect personal information from anyone.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Open Source & Inquiries</h2>
          <p>
            Use All Tools is open-source under the MIT license. You can review our client-side architecture or submit feedback directly through our <a href="https://github.com/Uniquearjav/anantastra" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
          </p>
        </section>
      </div>
    </div>
  );
}