"use client";

import { useEffect } from "react";

interface PEPhoneButtonProps {
  onVerify: (data: {
    user_country_code: string;
    user_phone_number: string;
    user_first_name: string;
    user_last_name: string;
  }) => void;
}

const PEPhoneButton: React.FC<PEPhoneButtonProps> = ({ onVerify }) => {
  useEffect(() => {
    // Load the external script
    const script = document.createElement("script");
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    document.querySelector(".pe_signin_button")?.appendChild(script);

    // Define the listener function
    (window as any).phoneEmailListener = async (userObj: { user_json_url: string }) => {
      const user_json_url = userObj.user_json_url;

      try {
        const response = await fetch("/api/verify-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url }),
        });

        const data = await response.json();
        if (data.error) {
          alert(`❌ Error: ${data.error}`);
        } else {
          // Pass the data to the parent component
          onVerify({
            user_country_code: data.user_country_code,
            user_phone_number: data.user_phone_number,
            user_first_name: data.user_first_name,
            user_last_name: data.user_last_name,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return () => {
      (window as any).phoneEmailListener = null;
    };
  }, [onVerify]);

  return (
    <div suppressHydrationWarning className="pe_signin_button"
      data-client-id="13006232029048972233"
    ></div>
  );
};

export default PEPhoneButton;
