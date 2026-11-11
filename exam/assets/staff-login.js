(function () {
  "use strict";

  const UI = window.UI;
  const $ = UI.$;
  const params = new URLSearchParams(window.location.search);
  let selectedType = "";

  function showSelectedLogin(type) {
    selectedType = type;
    $("#roleChoices").hidden = true;
    $("#staffLoginForm").hidden = false;
    $("#staffRecoveryForm").hidden = true;
    $("#staffResetForm").hidden = true;
    $("#staffRoleTitle").textContent =
      selectedType === "controller" ? "परीक्षा कंट्रोलर लॉगिन" : "स्टाफ लॉगिन";
    $("#staffIdentifierLabel").textContent =
      selectedType === "controller" ? "ईमेल या पुराना यूज़रनेम" : "ईमेल";
    $("#staffLoginForm [name=email]").focus();
  }

  function showRecovery() {
    $("#staffLoginForm").hidden = true;
    $("#staffRecoveryForm").hidden = false;
    $("#staffRecoveryMessage").hidden = true;
    $("#staffRecoveryForm [name=email]").focus();
  }

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
      showSelectedLogin(button.dataset.role);
    });
  });

  $("#staffRoleBack").addEventListener("click", () => {
    $("#staffLoginForm").hidden = true;
    $("#roleChoices").hidden = false;
    $("#staffLoginError").hidden = true;
  });

  $("#staffForgotPassword").addEventListener("click", showRecovery);
  $("#staffRecoveryBack").addEventListener("click", () => {
    $("#staffRecoveryForm").hidden = true;
    $("#staffLoginForm").hidden = false;
    $("#staffLoginForm [name=email]").focus();
  });

  $("#staffRecoveryForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = $("#staffRecoveryButton");
    const message = $("#staffRecoveryMessage");
    message.hidden = true;
    UI.setButtonBusy(button, true, "ईमेल जाँच रहे हैं…");
    try {
      const result = await UI.call("staff_forgot_password", {
        email: form.elements.email.value.trim(),
        expectedType: selectedType,
      });
      message.textContent = result.message;
      message.className = "notice info";
      message.hidden = false;
    } catch (error) {
      message.textContent = error.message || "रीसेट ईमेल नहीं भेजा जा सका।";
      message.className = "notice bad";
      message.hidden = false;
    } finally {
      UI.setButtonBusy(button, false);
    }
  });

  $("#staffResetForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const errorNode = $("#staffResetError");
    const button = $("#staffResetButton");
    errorNode.hidden = true;
    if (form.elements.password.value !== form.elements.confirmPassword.value) {
      errorNode.textContent = "दोनों पासवर्ड एक जैसे नहीं हैं।";
      errorNode.hidden = false;
      return;
    }
    UI.setButtonBusy(button, true, "पासवर्ड रीसेट हो रहा है…");
    try {
      const result = await UI.call("staff_reset_password", {
        token: params.get("reset") || "",
        newPassword: form.elements.password.value,
      });
      selectedType = result.profile?.type || "controller";
      showSelectedLogin(selectedType);
      $("#staffLoginForm [name=email]").value = result.profile?.email || "";
      $("#staffLoginError").textContent = result.message || "अब नए पासवर्ड से लॉगिन करें।";
      $("#staffLoginError").className = "notice good";
      $("#staffLoginError").hidden = false;
    } catch (error) {
      errorNode.textContent = error.message || "पासवर्ड रीसेट नहीं हो सका।";
      errorNode.hidden = false;
    } finally {
      UI.setButtonBusy(button, false);
    }
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
        if (identifier.includes("@")) {
          const result = await UI.call("staff_login", {
            email: identifier,
            password,
            expectedType: "controller",
          });
          redirectToStaff(result.profile, result.token);
          return;
        }
        const legacy = await UI.call("exam_controller_login", {
          username: identifier,
          password,
        });
        sessionStorage.setItem("fig.exam-controller.token", legacy.token);
        sessionStorage.setItem("fig.exam-controller.profile", JSON.stringify(legacy.controller));
        window.location.replace("controller.html");
        return;
      }
      const result = await UI.call("staff_login", { email: identifier, password, expectedType: "staff" });
      redirectToStaff(result.profile, result.token);
    } catch (error) {
      errorNode.textContent = error.message || "लॉगिन नहीं हो सका।";
      errorNode.className = "notice bad";
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
  } else if (params.get("reset")) {
    $("#roleChoices").hidden = true;
    $("#staffResetForm").hidden = false;
    $("#staffResetForm [name=password]").focus();
  } else if (params.get("role") === "controller" || params.get("role") === "staff") {
    showSelectedLogin(params.get("role"));
    if (params.get("forgot") === "1") showRecovery();
  }
})();
