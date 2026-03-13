import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create alpha2 | Monstra",
  description: "alpha2 setup page",
};

export default function CreateAlpha2Page() {
  return (
    <article>
      <h1>alpha2</h1>
      <p className='font-medium'>
        alpha2 is selected. This is the starter page for the alpha2 creation
        flow.
      </p>
    </article>
  );
}
