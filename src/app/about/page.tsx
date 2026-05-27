import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Varindo',
  description:
    'Varindo is an authorized dealer of Lamitak High Pressure Laminates in Indonesia, built on trust and driven by service.'
};

const values = [
  {
    title: 'Integrity',
    body: 'Committed to honesty, pricing transparency, and open communication at every stage.'
  },
  {
    title: 'Operational Excellence',
    body: 'Disciplined processes that ensure consistency and accuracy in every transaction.'
  },
  {
    title: 'Long-Term Partnership',
    body: 'Building mutually beneficial and lasting relationships with every client.'
  },
  {
    title: 'Continuous Improvement',
    body: 'Continuously improving systems and processes to become more efficient and professional.'
  }
];

export default function AboutPage() {
  return (
    <div>
      <div className="bg-varindo-ink text-white border-b border-varindo-800">
        <div className="shell py-14 sm:py-20">
          <p className="label text-varindo-400 mb-4">Company</p>
          <h1 className="display text-white text-5xl sm:text-6xl lg:text-7xl">
            About Varindo
          </h1>
        </div>
      </div>

      <div className="shell py-12 sm:py-16 max-w-5xl">

        <section className="border border-varindo-line bg-white mb-8">
          <div className="grid lg:grid-cols-[0.4fr_0.6fr]">
            <div className="border-b lg:border-b-0 lg:border-r border-varindo-line bg-varindo-50 px-8 py-10 flex flex-col justify-center">
              <p className="label text-varindo-gold mb-4">Mission</p>
              <h2 className="display text-varindo-ink text-3xl sm:text-4xl">
                Built on Trust.<br />Driven by Service.
              </h2>
            </div>
            <div className="px-8 py-10 space-y-5 text-[14px] leading-8 text-varindo-600">
              <p>
                Varindo is an authorized dealer of Lamitak High Pressure Laminates (HPL) in Indonesia. We are committed to delivering a transparent, professional, and dependable purchasing experience for all our customers.
              </p>
              <p>
                With a structured approach and well-organized systems, we ensure that every process — from quotation to delivery — is handled clearly, responsively, and consistently.
              </p>
              <p>
                We serve Lamitak HPL needs across various market segments in Indonesia, with a strong focus on long-term trust and responsible service.
              </p>
            </div>
          </div>
        </section>

        <section className="border border-varindo-line bg-varindo-ink text-white mb-8 px-8 py-10">
          <p className="label text-varindo-400 mb-4">Vision</p>
          <h2 className="display text-white text-3xl sm:text-4xl mb-5">
            Reliable Lamitak distribution across Indonesia.
          </h2>
          <div className="text-[14px] leading-8 text-varindo-400 max-w-2xl space-y-4">
            <p>
              To build a reliable and trusted Lamitak distribution network across Indonesia, with high standards of professionalism and consistency.
            </p>
            <p>
              To provide a clear, transparent, and trustworthy purchasing experience for Lamitak HPL through disciplined coordination, responsive service, and a continuously developing distribution system.
            </p>
          </div>
        </section>

        <section>
          <p className="label text-varindo-gold mb-6">Our Values</p>
          <div className="grid gap-px bg-varindo-line border border-varindo-line sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-7">
                <div className="w-6 h-[1.5px] bg-varindo-gold mb-4" />
                <h3 className="text-[14px] font-semibold text-varindo-ink mb-2">{value.title}</h3>
                <p className="text-[13px] leading-7 text-varindo-500">{value.body}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
