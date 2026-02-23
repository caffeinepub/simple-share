import { SiInstagram, SiTelegram } from 'react-icons/si';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 text-center">Contact</h1>
        </div>

        <div className="space-y-6">
          <a
            href="https://www.instagram.com/modxrdx?igsh=dmRpazF4M2dndHE2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-card rounded-lg border border-border hover:bg-accent transition-colors group"
          >
            <SiInstagram className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <p className="text-lg font-medium">Instagram ~</p>
              <p className="text-sm text-muted-foreground">@modxrdx</p>
            </div>
          </a>

          <a
            href="https://t.me/MODxRDX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-card rounded-lg border border-border hover:bg-accent transition-colors group"
          >
            <SiTelegram className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <p className="text-lg font-medium">Telegram ~</p>
              <p className="text-sm text-muted-foreground">@MODxRDX</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
