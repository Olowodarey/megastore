"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../_lib/hooks";
import { setCredentials } from "../_lib/authSlice";
import { useGoogleAuthMutation } from "../_services/authApi";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const GoogleSignInButton = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [googleAuth] = useGoogleAuthMutation();

  if (!GOOGLE_CLIENT_ID) return null;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const res = await googleAuth({ idToken: credentialResponse.credential }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token }));
      router.push("/");
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error("Google sign-in failed. Please try again.")}
          useOneTap={false}
          width="320"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignInButton;
