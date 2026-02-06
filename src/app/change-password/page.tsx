import ChangePasswordForm from "@/components/modules/Auth/ChangePasswordForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Change your account password",
};

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Security</h1>
          <p className="text-gray-600 mt-2">
            Keep your account safe with a strong password
          </p>
        </div>
        <ChangePasswordForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our{" "}
            <Link
              href="/support"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
