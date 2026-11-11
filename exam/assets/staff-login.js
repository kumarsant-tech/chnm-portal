(function () {
  "use strict";

  const UI = window.UI;
  const $ = UI.$;
  const params = new URLSearchParams(window.location.search);
  let selectedType = "";

  function redirectToStaff(profile, token) {
    UI.setStaffSession(token, profile);
    const firstRoute = profile.permissions?.includes("exams")
      ? "exams"
      : profile.permissions?.includes("questions")
        ? "questions"
        : profile.permissions?.includes("students")
          ? "students"
          : profile.permissions?.includes("notices")
            ? "notify"
            : profile.permissions?.includes("reports")
              ? "stats"
              : "tools";
    window.location.replace("admin.html?staff=1#" + firstRoute);
  }

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedType = button.dataset.role;
      $("#roleChoices").hidden = true;
      $("#staffLoginForm").hidden = false;
      $("#staffRoleTitle").textContent =
        selectedType === "controller" ? "परीक्षा कंट्रोलर लॉगिन" : "स्टाफ लॉगिन";
      $("#staffIdentifierLabel").textContent =
        selectedType === "controller" ? "ईमेल या पुराना यूज़रनेम" : "ईमेल";
      $("#staffLoginForm [name=email]").focus();
    });
  });

  $("#staffRoleBack").addEventListener("click", () => {
    $("#staffLoginForm").hidden = true;
    $("#roleChoices").hidden = false;
    $("#staffLoginError").hidden = true;
  });

  $("#staffLoginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const errorNode = $("#staffLoginError");
    const button = $("#staffLoginButton");
    errorNode.hidden = true;
    UI.setButtonBusy(button, true, "लॉगिन हो रहा है…");
    try {
      const identifier = form.elements.email.value.trim();
      const password = form.elements.password.value;
      if (selectedType === "controller") {
        try {
          const result = await UI.call("staff_login", {
            email: identifier,
            password,
            expectedType: "controller",
          });
          redirectToStaff(result.profile, result.token);
          return;
        } catch {
          const legacy = await UI.call("exam_controller_login", {
            username: identifier,
            password,
          });
          sessionStorage.setItem("fig.exam-controller.token", legacy.token);
          sessionStorage.setItem("fig.exam-controller.profile", JSON.stringify(legacy.controller));
          window.location.replace("controller.html");
          return;
        }
      }
      const result = await UI.call("staff_login", { email: identifier, password, expectedType: "staff" });
      redirectToStaff(result.profile, result.token);
    } catch (error) {
      errorNode.textContent = error.message || "लॉगिन नहीं हो सका।";
      errorNode.hidden = false;
    } finally {
      UI.setButtonBusy(button, false);
    }
  });

  $("#staffSetupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const errorNode = $("#staffSetupError");
    const button = $("#staffSetupButton");
    const password = form.elements.password.value;
    errorNode.hidden = true;
    if (password !== form.elements.confirmPassword.value) {
      errorNode.textContent = "दोनों पासवर्ड एक जैसे नहीं हैं।";
      errorNode.hidden = false;
      return;
    }
    UI.setButtonBusy(button, true, "पासवर्ड सेव हो रहा है…");
    try {
      const result = await UI.call("staff_setup_password", {
        token: params.get("setup") || "",
        newPassword: password,
      });
      redirectToStaff(result.profile, result.token);
    } catch (error) {
      errorNode.textContent = error.message || "पासवर्ड सेट नहीं हो सका।";
      errorNode.hidden = false;
    } finally {
      UI.setButtonBusy(button, false);
    }
  });

  if (params.get("setup")) {
    $("#roleChoices").hidden = true;
    $("#staffSetupForm").hidden = false;
    $("#staffSetupForm [name=password]").focus();
  }
})();
