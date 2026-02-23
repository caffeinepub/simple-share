import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">About MOD x RDX</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            A minimal platform for sharing content
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                MOD x RDX is a clean, fast-loading platform designed for sharing text content, links, and images
                without unnecessary complexity. We believe in keeping things simple and focused.
              </p>
              <p>
                Our goal is to provide a distraction-free environment where you can quickly share and discover
                content that matters to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Share text posts, links, and images</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Search through posts by title or description</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Clean, minimal interface with no distractions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Fast loading and responsive design</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>No login required - just start sharing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                MOD x RDX is built on the Internet Computer blockchain, ensuring your content is stored
                securely and permanently in a decentralized manner.
              </p>
              <p>
                We use modern web technologies to deliver a fast, responsive experience across all devices.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
