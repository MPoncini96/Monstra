
import { SignUp } from "@clerk/nextjs";

const appearance = {
  variables: {
    colorPrimary: "#8646f4",
    colorBackground: "#030014",
    colorText: "#fff",
    colorInputBackground: "#191625",
    colorInputText: "#fff",
    colorInputBorder: "#5b21b6",
    colorDanger: "#d345f8", // purple-pink for errors
    colorWarning: "#8646f4", // purple for warnings
    colorSuccess: "#8646f4", // purple for success
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontFamily: "Plus Jakarta Sans, sans-serif",
  },
  elements: {
    card: "bg-dark/80 shadow-lg border border-purple-dark",
    headerTitle: "text-purple text-3xl font-bold",
    headerSubtitle: "text-dark-4",
    formButtonPrimary: "bg-gold-dark hover:bg-gold-darker text-dark-6 font-semibold py-2 rounded-lg transition border-none",
    formFieldInput: "bg-dark-6 text-white border-purple-dark focus:border-purple outline-none",
    footerAction: "text-purple hover:underline",
    alert: "text-purple border-purple",
    alertText: "text-purple",
    alertIcon: "text-purple",
    formFieldWarning: "text-purple border-purple",
    formFieldSuccess: "text-purple border-purple",
    socialButtonsBlockButton: "bg-purple hover:bg-purple-dark text-white font-semibold py-2 rounded-lg transition border-none",
    socialButtonsBlockButtonText: "text-white",
  },
};


export default function Page() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SignUp
        appearance={appearance}
        afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/create-username"}
      />
    </div>
  );
}
