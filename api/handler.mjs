import { getDb } from "./lib/db.mjs";
import { HttpError, fail, json, readJson } from "./lib/http.mjs";
import { ensureSeed } from "./lib/seed.mjs";
import {
  requireAdmin,
  requireAdminOrStaff,
  requireExamController,
  requireStaffSession,
  requireStudent,
} from "./lib/auth.mjs";
import { STAFF_ACTION_PERMISSIONS } from "./lib/permissions.mjs";
import {
  handleBootstrap,
  handleRegister,
  handleStudentLogin,
  handleStudentForgotPassword,
  handleStudentResetPassword,
  handleStudentPasswordChange,
} from "./lib/api-public.mjs";
import {
  handleStudentAutosave,
  handleStudentDashboard,
  handleStudentExamGet,
  handleStudentExamPaper,
  handleStudentResultGet,
  handleStudentResults,
  handleStudentStart,
  handleStudentSubmit,
} from "./lib/api-student.mjs";
import {
  handleAdminAttemptFinalize,
  handleAdminAudit,
  handleAdminExamDelete,
  handleAdminExamGet,
  handleAdminExamLock,
  handleAdminExamPaper,
  handleAdminExamPreview,
  handleAdminExamPublish,
  handleAdminExamRelease,
  handleAdminExamSave,
  handleAdminExamUnpublish,
  handleAdminExams,
  handleAdminExport,
  handleAdminExamControllerGet,
  handleAdminExamControllerSave,
  handleExamControllerLogin,
  handleStaffLogin,
  handleStaffSetupPassword,
  handleStaffMe,
  handleStaffPasswordChange,
  handleAdminStaffList,
  handleAdminStaffSave,
  handleAdminStaffInvite,
  handleAdminProfileGet,
  handleAdminProfileSave,
  handleLegacyControllerPasswordChange,
  handleLegacyControllerAccountUpgrade,
  handleExamControllerExams,
  handleExamControllerCatalog,
  handleExamControllerCreate,
  handleExamControllerLock,
  handleExamControllerUnpublish,
  handleExamControllerLive,
  handleExamControllerAttemptFinalize,
  handleAdminLegacyImport,
  handleAdminLegacyPreview,
  handleAdminLive,
  handleAdminLogin,
  handleAdminForgotPassword,
  handleAdminResetPassword,
  handleAdminPasswordChange,
  handleAdminOverview,
  handleAdminQuestionDelete,
  handleAdminQuestionGet,
  handleAdminQuestions,
  handleAdminQuestionsImport,
  handleAdminQuestionSave,
  handleAdminResultGet,
  handleAdminResults,
  handleAdminResultsCsv,
  handleAdminSettingsSave,
  handleAdminStats,
  handleAdminStudentDelete,
  handleAdminStudentGet,
  handleAdminStudentSave,
  handleAdminStudents,
  handleAdminStudentStatus,
  handleAdminSubjectDelete,
  handleAdminSubjects,
  handleAdminSubjectSave,
  handleAdminTradeDelete,
  handleAdminTrades,
  handleAdminTradeSave,
} from "./lib/api-admin.mjs";
import {
  handleAdminChat,
  handleAdminChatDelete,
  handleAdminChatSend,
  handleAdminNoticeDelete,
  handleAdminNoticeSave,
  handleAdminNotices,
  handleAdminPaperBuild,
  handleAdminTopics,
  handleChatList,
  handleChatSend,
  handleNoticeRead,
  handleNotices,
  handleSiteNotices,
} from "./lib/api-notify.mjs";

const PUBLIC_ACTIONS = {
  bootstrap: handleBootstrap,
  register: handleRegister,
  student_login: handleStudentLogin,
  student_forgot_password: handleStudentForgotPassword,
  student_reset_password: handleStudentResetPassword,
  admin_login: handleAdminLogin,
  admin_forgot_password: handleAdminForgotPassword,
  admin_reset_password: handleAdminResetPassword,
  exam_controller_login: handleExamControllerLogin,
  staff_login: handleStaffLogin,
  staff_setup_password: handleStaffSetupPassword,
  site_notices: handleSiteNotices,
};

const STUDENT_ACTIONS = {
  student_password_change: handleStudentPasswordChange,
  student_dashboard: handleStudentDashboard,
  student_exam_get: handleStudentExamGet,
  student_start: handleStudentStart,
  student_exam_paper: handleStudentExamPaper,
  student_autosave: handleStudentAutosave,
  student_submit: handleStudentSubmit,
  student_result_get: handleStudentResultGet,
  student_results: handleStudentResults,
  notices_list: handleNotices,
  notice_read: handleNoticeRead,
  chat_list: handleChatList,
  chat_send: handleChatSend,
};

const ADMIN_ACTIONS = {
  admin_overview: handleAdminOverview,
  admin_exams: handleAdminExams,
  admin_exam_get: handleAdminExamGet,
  admin_exam_save: handleAdminExamSave,
  admin_exam_paper: handleAdminExamPaper,
  admin_exam_lock: handleAdminExamLock,
  admin_exam_publish: handleAdminExamPublish,
  admin_exam_unpublish: handleAdminExamUnpublish,
  admin_exam_release: handleAdminExamRelease,
  admin_exam_delete: handleAdminExamDelete,
  admin_exam_preview: handleAdminExamPreview,
  admin_subjects: handleAdminSubjects,
  admin_subject_save: handleAdminSubjectSave,
  admin_subject_delete: handleAdminSubjectDelete,
  admin_trades: handleAdminTrades,
  admin_trade_save: handleAdminTradeSave,
  admin_trade_delete: handleAdminTradeDelete,
  admin_questions: handleAdminQuestions,
  admin_question_get: handleAdminQuestionGet,
  admin_question_save: handleAdminQuestionSave,
  admin_question_delete: handleAdminQuestionDelete,
  admin_questions_import: handleAdminQuestionsImport,
  admin_students: handleAdminStudents,
  admin_student_get: handleAdminStudentGet,
  admin_student_save: handleAdminStudentSave,
  admin_student_status: handleAdminStudentStatus,
  admin_student_delete: handleAdminStudentDelete,
  admin_attempt_finalize: handleAdminAttemptFinalize,
  admin_results: handleAdminResults,
  admin_result_get: handleAdminResultGet,
  admin_results_csv: handleAdminResultsCsv,
  admin_stats: handleAdminStats,
  admin_settings_save: handleAdminSettingsSave,
  admin_exam_controller_get: handleAdminExamControllerGet,
  admin_exam_controller_save: handleAdminExamControllerSave,
  admin_password_change: handleAdminPasswordChange,
  admin_audit: handleAdminAudit,
  admin_legacy_preview: handleAdminLegacyPreview,
  admin_legacy_import: handleAdminLegacyImport,
  admin_live: handleAdminLive,
  admin_export: handleAdminExport,
  admin_notices: handleAdminNotices,
  admin_notice_save: handleAdminNoticeSave,
  admin_notice_delete: handleAdminNoticeDelete,
  admin_chat: handleAdminChat,
  admin_chat_send: handleAdminChatSend,
  admin_chat_delete: handleAdminChatDelete,
  admin_topics: handleAdminTopics,
  admin_paper_build: handleAdminPaperBuild,
  admin_staff_list: handleAdminStaffList,
  admin_staff_save: handleAdminStaffSave,
  admin_staff_invite: handleAdminStaffInvite,
  admin_profile_get: handleAdminProfileGet,
  admin_profile_save: handleAdminProfileSave,
};

const STAFF_ACTIONS = {
  staff_me: handleStaffMe,
  staff_password_change: handleStaffPasswordChange,
};

const EXAM_CONTROLLER_ACTIONS = {
  controller_exams: handleExamControllerExams,
  controller_catalog: handleExamControllerCatalog,
  controller_exam_create: handleExamControllerCreate,
  controller_exam_lock: handleExamControllerLock,
  controller_live: handleExamControllerLive,
  controller_attempt_finalize: handleExamControllerAttemptFinalize,
  controller_password_change: handleLegacyControllerPasswordChange,
  controller_account_upgrade: handleLegacyControllerAccountUpgrade,
};

export default async (req, ctx) => {
  let action = "";
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST अनुरोध आवश्यक है" }), {
        status: 405,
        headers: { "content-type": "application/json; charset=utf-8", allow: "POST" },
      });
    }
    const body = await readJson(req);
    action = typeof body.action === "string" ? body.action.trim() : "";
    if (!action) throw new HttpError("action आवश्यक है", 400);
    const env = ctx?.env || {};
    let store;
    try {
      store = await getDb(env);
    } catch (error) {
      console.error("db unavailable", {
        action,
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorCode:
          typeof error?.code === "string" && /^[A-Z0-9_]{1,40}$/.test(error.code)
            ? error.code
            : undefined,
      });
      return fail(
        "डेटाबेस उपलब्ध नहीं है — deployment और database binding जाँचें",
        503
      );
    }
    await ensureSeed(store);

    if (PUBLIC_ACTIONS[action]) {
      return await PUBLIC_ACTIONS[action]({ req, ctx, env, store, body });
    }

    if (STUDENT_ACTIONS[action]) {
      const student = await requireStudent(req, store, env, action === "student_password_change");
      return await STUDENT_ACTIONS[action]({ req, ctx, env, store, body, student });
    }

    if (STAFF_ACTIONS[action]) {
      const staff = await requireStaffSession(
        req,
        store,
        env,
        null,
        { allowPasswordChange: action === "staff_password_change" || action === "staff_me" }
      );
      return await STAFF_ACTIONS[action]({ req, ctx, env, store, body, staff });
    }

    const controllerHandler = EXAM_CONTROLLER_ACTIONS[action];
    if (controllerHandler) {
      const controller = await requireExamController(
        req,
        store,
        env,
        {
          allowPasswordChange: action === "controller_password_change",
          allowAccountUpgrade: action === "controller_account_upgrade",
        }
      );
      return await controllerHandler({
        req,
        ctx,
        env,
        store,
        controller,
        actor: `exam_controller:${controller.username}`,
      });
    }

    const handler = ADMIN_ACTIONS[action];
    if (handler) {
      const permission = STAFF_ACTION_PERMISSIONS[action];
      if (permission) {
        const access = await requireAdminOrStaff(req, store, env, permission);
        const response = await handler({
          req,
          ctx,
          env,
          store,
          body,
          admin: access.admin,
          staff: access.staff,
        });
        if (
          access.staff &&
          response.ok &&
          ["admin_exam_get", "admin_exams", "admin_overview"].includes(action)
        ) {
          const data = await response.json();
          if (action === "admin_exam_get") {
            data.exam.resultCount = 0;
            data.exam.activeAttempts = 0;
            data.attempts = [];
            data.results = [];
            delete data.stats;
          } else if (action === "admin_exams") {
            data.exams = (data.exams || []).map((exam) => ({
              ...exam,
              resultCount: 0,
            }));
          } else {
            data.recentResults = [];
            data.recentAudit = [];
            data.legacy = null;
            data.summary = {
              exams: data.summary?.exams || 0,
              examStatus: data.summary?.examStatus || {},
              questions: data.summary?.questions || 0,
              students: data.summary?.students || 0,
            };
          }
          return json(data);
        }
        return response;
      }
      const admin = await requireAdmin(req, store, env);
      return await handler({ req, ctx, env, store, body, admin, staff: null });
    }

    return json({ error: "अज्ञात action", action }, 400);
  } catch (error) {
    if (error instanceof HttpError) {
      return fail(error.message, error.status, error.details);
    }
    console.error("api error", {
      action: action || "unknown",
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorCode:
        typeof error?.code === "string" && /^[A-Z0-9_]{1,40}$/.test(error.code)
          ? error.code
          : undefined,
    });
    return fail("सर्वर में तकनीकी त्रुटि हुई — कृपया दोबारा प्रयास करें", 500);
  }
};

export const config = { path: "/api" };
