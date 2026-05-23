import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Varindo',
  description:
    'Varindo is an authorized dealer of Lamitak High Pressure Laminates in Indonesia, built on trust and driven by service.'
};

const values = [
  {
    title: 'Integrity',
    body: 'We are committed to honesty, pricing transparency, and open communication.'
  },
  {
    title: 'Operational Excellence',
    body: 'We carry out our processes with discipline to ensure consistency and accuracy in every transaction.'
  },
  {
    title: 'Long-Term Partnership',
    body: 'We build mutually beneficial and long-term relationships.'
  },
  {
    title: 'Continuous Improvement',
    body: 'We continuously improve our systems and processes to become more efficient and professional.'
  }
];

export default function AboutPage() {
  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-stone-950 sm:text-6xl">
          Company
        </h1>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-stone-950 sm:text-4xl">
            Varindo | Built on Trust. Driven by Service.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-stone-600 sm:text-lg">
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
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-stone-200 bg-stone-950 p-6 text-white shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">Vision and Mission</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Reliable Lamitak distribution across Indonesia.
            </h2>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-5 text-base leading-8 text-stone-600 sm:text-lg">
              <p>
                To build a reliable and trusted Lamitak distribution network across Indonesia, with high standards of professionalism and consistency.
              </p>
              <p>
                To provide a clear, transparent, and trustworthy purchasing experience for Lamitak HPL through disciplined coordination, responsive service, and a continuously developing distribution system.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <p className="eyebrow">Our Values</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="soft-card p-6 sm:p-7">
                <h3 className="text-xl font-black tracking-[-0.02em] text-stone-950">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">{value.body}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
