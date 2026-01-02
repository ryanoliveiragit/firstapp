import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8 grid-background">
      <div className="scan-line" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <h1 className="text-4xl font-bold text-glow text-center mb-8">
          Tailwind CSS & shadcn/ui Test
        </h1>

        {/* Test Tailwind Utilities */}
        <Card>
          <CardHeader>
            <CardTitle>Tailwind Utilities Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-lg">
              Primary Background
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
              Secondary Background
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded-lg">
              Muted Background
            </div>
          </CardContent>
        </Card>

        {/* Test Custom Classes */}
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="text-glow">Custom Effects Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg glow-red">
              Glow Red Effect
            </div>
            <div className="p-4 bg-card border border-border rounded-lg glow-red-strong">
              Glow Red Strong Effect
            </div>
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui Buttons Test</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* Test Responsive Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Grid Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center"
                >
                  Grid Item {i}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Animations Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary rounded-lg animate-pulse-glow text-center">
              Pulse Glow Animation
            </div>
            <div className="flex gap-4 justify-center">
              <div className="w-12 h-12 bg-primary rounded-full animate-spin" />
              <div className="w-12 h-12 bg-primary rounded-full animate-ping" />
              <div className="w-12 h-12 bg-primary rounded-full animate-bounce" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
