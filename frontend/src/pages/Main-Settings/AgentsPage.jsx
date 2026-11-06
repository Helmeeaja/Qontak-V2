import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash,
  UserPlus,
  Camera,
  X,
} from "@phosphor-icons/react";
import api from "@/services/api";
import {
  btnPrimary,
  btnSecondary,
  btnDangerOutline,
  btnModalCancel,
  btnModalSubmit,
  btnModalDelete,
  statCard,
  statLabel,
  tableCard,
  tableWrapper,
  tableBase,
  th,
  td,
  trHover,
  modalOverlay,
  modalPanel,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalFooter,
  formGroup,
  formLabel,
  formRequiredMark,
  inputBase,
  pageSpinner,
  buttonSpinner,
} from "@/components/ui/styles";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
};

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAgent, setEditAgent] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fileInputRef = useRef(null);

  // =========================
  // GET AGENTS
  // =========================
  const fetchAgents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/agents/");

      const data = response.data;

      // Support response array maupun pagination
      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        setAgents(data?.results || []);
      }
    } catch (error) {
      console.error("Fetch agents error:", error);
      alert(
        error.response?.data?.detail ||
          "Gagal mengambil data agent."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // OPEN CREATE
  // =========================
  const openCreate = () => {
    setEditAgent(null);
    setForm(emptyForm);
    setAvatarFile(null);
    setAvatarPreview(null);
    setDialogOpen(true);
  };

  // =========================
  // OPEN EDIT
  // =========================
  const openEdit = (agent) => {
    setEditAgent(agent);

    setForm({
      username: agent.username || "",
      email: agent.email || "",
      password: "",
      first_name: agent.first_name || "",
      last_name: agent.last_name || "",
      phone: agent.phone || "",
    });

    setAvatarFile(null);
    setAvatarPreview(agent.avatar_url || null);
    setDialogOpen(true);
  };

  // =========================
  // AVATAR
  // =========================
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // =========================
  // SUBMIT CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLoading) return;

    // Validasi create
    if (!editAgent && form.password.length < 8) {
      alert("Password minimal 8 karakter.");
      return;
    }

    if (!form.username.trim()) {
      alert("Username wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      alert("Email wajib diisi.");
      return;
    }

    try {
      setSubmitLoading(true);

      const formData = new FormData();

      formData.append("username", form.username.trim());
      formData.append("email", form.email.trim());
      formData.append("first_name", form.first_name.trim());
      formData.append("last_name", form.last_name.trim());
      formData.append("phone", form.phone.trim());

      if (!editAgent) {
        formData.append("password", form.password);
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      let response;

      if (editAgent) {
        response = await api.put(
          `/agents/${editAgent.id}/`,
          formData
        );

        alert("Agent berhasil diperbarui.");
      } else {
        response = await api.post(
          "/agents/",
          formData
        );

        alert("Agent berhasil dibuat.");
      }

      console.log("Agent response:", response.data);

      setDialogOpen(false);
      setForm(emptyForm);
      setEditAgent(null);
      setAvatarFile(null);
      setAvatarPreview(null);

      await fetchAgents();
    } catch (error) {
      console.error("Agent submit error:", error);
      console.error(
        "Server response:",
        error.response?.data
      );

      const data = error.response?.data;

      let message = "Gagal menyimpan agent.";

      if (data?.detail) {
        message = data.detail;
      } else if (
        data &&
        typeof data === "object"
      ) {
        const firstError = Object.values(data)[0];

        if (Array.isArray(firstError)) {
          message = firstError[0];
        } else if (typeof firstError === "string") {
          message = firstError;
        }
      }

      alert(String(message));
    } finally {
      setSubmitLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async () => {
    if (!deleteId || deleteLoading) return;

    try {
      setDeleteLoading(true);

      await api.delete(`/agents/${deleteId}/`);

      alert("Agent berhasil dihapus.");

      setDeleteId(null);

      await fetchAgents();
    } catch (error) {
      console.error("Delete agent error:", error);

      alert(
        error.response?.data?.detail ||
          "Gagal menghapus agent."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================
  // AVATAR FALLBACK
  // =========================
  const getInitial = (agent) => {
    const name =
      `${agent.first_name || ""} ${
        agent.last_name || ""
      }`.trim();

    return (
      name.charAt(0) ||
      agent.username?.charAt(0) ||
      "A"
    ).toUpperCase();
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="mx-auto max-w-[1400px] p-6 max-md:p-4">

      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 max-md:items-stretch">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[10px] bg-brand text-white">
            <UserPlus size={26} weight="bold" />
          </div>

          <div>
            <h1 className="m-0 text-[28px] font-bold text-gray-900 max-md:text-2xl">
              Agents
            </h1>
            <p className="m-0 mt-1 text-sm text-slate-500">
              Kelola data agent QontakSales
            </p>
          </div>
        </div>

        <button
  type="button"
  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 max-md:w-full"
  onClick={openCreate}
>
  <Plus size={18} />
  Add Agent
</button>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-3 gap-4 max-md:grid-cols-1">

        <div className={statCard}>
          <span className={statLabel}>Total Agents</span>
          <strong className="text-[28px] text-gray-900">{agents.length}</strong>
        </div>

        <div className={statCard}>
          <span className={statLabel}>Managers</span>
          <strong className="text-[28px] text-gray-900">
            {
              agents.filter(
                (agent) =>
                  agent.role === "MANAGER"
              ).length
            }
          </strong>
        </div>

        <div className={statCard}>
          <span className={statLabel}>Agents</span>
          <strong className="text-[28px] text-gray-900">
            {
              agents.filter(
                (agent) =>
                  agent.role === "AGENT"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* TABLE CARD */}
      <div className={tableCard}>

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2.5 p-10 text-slate-500">
            <div className={`${pageSpinner} h-[22px] w-[22px]`} />
            <p className="m-0">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2.5 p-10 text-slate-500">
            <UserPlus size={40} />

            <h2 className="m-0 text-xl text-gray-900">
              Belum ada agent
            </h2>

            <p className="m-0 mb-2">
              Klik Add Agent untuk
              menambahkan agent.
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              onClick={openCreate}
            >
              <Plus size={18} />
              Add Agent
            </button>
          </div>
        ) : (
          <div className={tableWrapper}>
            <table className={`${tableBase} min-w-[760px]`}>
              <thead>
                <tr>
                  <th className={th}>Agent</th>
                  <th className={th}>Email</th>
                  <th className={th}>Phone</th>
                  <th className={th}>Role</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id} className={trHover}>

                    {/* AGENT */}
                    <td className={td}>
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700">
                          {agent.avatar_url ? (
                            <img
                              src={agent.avatar_url}
                              alt={
                                agent.username ||
                                "Agent"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>
                              {getInitial(agent)}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold text-gray-900">
                            {agent.first_name || ""}{" "}
                            {agent.last_name || ""}
                          </div>

                          <div className="mt-[3px] text-xs text-slate-400">
                            @{agent.username}
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className={td}>{agent.email}</td>

                    {/* PHONE */}
                    <td className={td}>{agent.phone || "-"}</td>

                    {/* ROLE */}
                    <td className={td}>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-[5px] text-xs font-semibold ${
                          agent.role === "MANAGER"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {agent.role}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className={td}>
                      <div className="flex items-center gap-2 max-md:flex-col max-md:items-stretch">

                        <button
                          type="button"
                          className={`${btnSecondary} max-md:justify-center`}
                          onClick={() =>
                            openEdit(agent)
                          }
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className={`${btnDangerOutline} max-md:justify-center`}
                          onClick={() =>
                            setDeleteId(agent.id)
                          }
                        >
                          <Trash size={14} />
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      {dialogOpen && (
        <div
          className={modalOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              if (!submitLoading) {
                setDialogOpen(false);
              }
            }
          }}
        >
          <div className={`${modalPanel} max-w-[520px]`}>

            <div className={modalHeader}>
              <h2 className={modalTitle}>
                {editAgent
                  ? "Edit Agent"
                  : "Add Agent"}
              </h2>

              <button
                type="button"
                className={modalCloseButton}
                onClick={() => {
                  if (!submitLoading) {
                    setDialogOpen(false);
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="max-h-[65vh] overflow-y-auto p-[22px] max-md:max-h-[60vh]">

                {/* AVATAR */}
                <div className="mb-[22px] flex flex-col items-center gap-3">

                  <div className="flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full bg-blue-100 text-[30px] font-bold text-blue-700">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>
                        {getInitial({
                          first_name:
                            form.first_name,
                          last_name:
                            form.last_name,
                          username:
                            form.username,
                        })}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-[7px] rounded-[7px] border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-700 transition-colors hover:bg-slate-50"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <Camera size={16} />
                    Upload Avatar
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />

                </div>

                {/* USERNAME */}
                <div className={formGroup}>
                  <label className={formLabel}>
                    Username
                    <span className={formRequiredMark}>*</span>
                  </label>

                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Masukkan username"
                    disabled={!!editAgent}
                    className={inputBase}
                  />
                </div>

                {/* EMAIL */}
                <div className={formGroup}>
                  <label className={formLabel}>
                    Email
                    <span className={formRequiredMark}>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="agent@example.com"
                    className={inputBase}
                  />
                </div>

                {/* PASSWORD */}
                {!editAgent && (
                  <div className={formGroup}>
                    <label className={formLabel}>
                      Password
                      <span className={formRequiredMark}>*</span>
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimal 8 karakter"
                      className={inputBase}
                    />

                    <small className="mt-[5px] block text-xs text-slate-500">
                      Password minimal 8 karakter.
                    </small>
                  </div>
                )}

                {/* FIRST NAME */}
                <div className={formGroup}>
                  <label className={formLabel}>First Name</label>

                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="Nama depan"
                    className={inputBase}
                  />
                </div>

                {/* LAST NAME */}
                <div className={formGroup}>
                  <label className={formLabel}>Last Name</label>

                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Nama belakang"
                    className={inputBase}
                  />
                </div>

                {/* PHONE */}
                <div className={formGroup}>
                  <label className={formLabel}>Phone</label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className={inputBase}
                  />
                </div>

              </div>

              <div className={modalFooter}>

                <button
                  type="button"
                  className={btnModalCancel}
                  onClick={() => {
                    if (!submitLoading) {
                      setDialogOpen(false);
                    }
                  }}
                  disabled={submitLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <span className={buttonSpinner} />
                      Saving...
                    </>
                  ) : (
                    editAgent
                      ? "Update"
                      : "Create"
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}
      {deleteId && (
        <div className={modalOverlay}>
          <div className={`${modalPanel} max-w-[420px]`}>

            <div className={modalHeader}>
              <h2 className={modalTitle}>Hapus Agent?</h2>
            </div>

            <div className="p-[22px]">
              <p className="m-0 text-slate-600">
                Apakah lo yakin mau menghapus
                agent ini?
              </p>
            </div>

            <div className={modalFooter}>

              <button
                type="button"
                className={btnModalCancel}
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleteLoading}
              >
                Batal
              </button>

              <button
                type="button"
                className={btnModalDelete}
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className={buttonSpinner} />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash size={16} />
                    Hapus
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}