export function About() {
  return (
    <>
      <title>About</title>
      <meta name="description" content="Learn more about us" />

      <main className="min-h-screen bg-paper py-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mb-8">
            About <span className="text-gold">Us</span>
          </h1>

          <div className="space-y-6 text-ink/80 font-body">
            <p className="text-lg leading-relaxed">
              Welcome to{' '}
              <span className="text-gold font-medium">Signature Salon</span>,
              where every cut carries your signature.
            </p>

            <p className="text-base leading-relaxed">
              Located in the heart of Batajnica, Belgrade, we believe that great
              hair is more than just a style—it's an expression of who you are.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/"
                className="inline-block px-6 py-3 rounded-full bg-ink text-paper hover:bg-gold hover:text-ink transition-colors duration-300"
              >
                ← Back to home
              </a>
              <a
                href="#services"
                className="inline-block px-6 py-3 rounded-full border border-ink/20 text-ink hover:border-gold hover:text-gold transition-colors duration-300"
              >
                View services
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
