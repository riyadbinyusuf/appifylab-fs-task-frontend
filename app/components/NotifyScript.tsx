"use client";

import Script from "next/script";

export default function NotifyScript() {
  return (
    <Script
      id="notify-drop"
      strategy="afterInteractive"
      onLoad={() => {
        var notifyDropdown = document.querySelector("#_notify_drop");
        var notifyDropShowBtn = document.querySelector("#_notify_btn");
        var isDropShow1 = false;

        if (notifyDropdown && notifyDropShowBtn) {
          notifyDropShowBtn.addEventListener("click", function () {
            isDropShow1 = !isDropShow1;
            if (isDropShow1) {
              notifyDropdown?.classList.add("show");
            } else {
              notifyDropdown?.classList.remove("show");
            }
          });
        }


      }}
    />
  );
}
