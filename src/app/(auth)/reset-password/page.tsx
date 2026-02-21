import ResetPasswordLoading from "@/components/modules/Auth/ResetPassword/ResetLoading";
import ResetPasswordForm from "@/components/modules/Auth/ResetPassword/ResetPassword";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
