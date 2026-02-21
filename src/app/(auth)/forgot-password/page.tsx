import ForgotPasswordForm from "@/components/modules/Auth/ForgetPassword/ForgetPassword";
import ForgotPasswordLoading from "@/components/modules/Auth/ForgetPassword/ForgetPasswordLoading";
import { Suspense } from "react";

const ForgetPasswordPage = () => {
  return (
    <div>
      <Suspense fallback={<ForgotPasswordLoading />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
};

export default ForgetPasswordPage;
