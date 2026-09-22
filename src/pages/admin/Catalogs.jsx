import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";

const CATALOG_TYPES = [
  { key: "approaches",  label: "Enfoques terapéuticos", icon: "ti-brain" },
  { key: "modalities",  label: "Modalidades de terapia", icon: "ti-device-laptop" },
  { key: "populations", label: "Poblaciones atendidas",  icon: "ti-users" },
];

export default function Catalogs() {
  const [activeType, setActiveType]   = useState("approaches");
  const [items, setItems]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState(null);
  const [saving, setSaving]           = useState(false);
  const [form, setForm]               = useState({ name: "", description: "", icon: "", is_active: true });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/admin/catalogs/${activeType}`);
      setItems(res.data);
    } catch {
      setError("Error al cargar el catálogo.");
    } finally {
      setLoading(false);
    }
  }, [activeType]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", icon: "", is_active: true });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description ?? "", icon: item.icon ?? "", is_active: item.is_active });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("El nombre es requerido."); return; }
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await apiClient.put(`/admin/catalogs/${activeType}/${editing.id}`, form);
      } else {
        await apiClient.post(`/admin/catalogs/${activeType}`, form);
      }
      setShowForm(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await apiClient.delete(`/admin/catalogs/${activeType}/${item.id}`);
      fetchItems();
    } catch {
      setError("Error al eliminar el ítem.");
    }
  };

  const handleToggle = async (item) => {
    try {
      await apiClient.put(`/admin/catalogs/${activeType}/${item.id}`, { is_active: !item.is_active });
      fetchItems();
    } catch {
      setError("Error al actualizar el estado.");
    }
  };

  const activeTab = CATALOG_TYPES.find(t => t.key === activeType);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Catálogos</h1>
          <p className="text-slate-500 mt-1">Gestiona enfoques, modalidades y poblaciones del sistema.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <i className="ti ti-plus text-base" />
          Agregar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATALOG_TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveType(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeType === t.key
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <i className={`ti ${t.icon} text-base`} />
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <i className={`ti ${activeTab?.icon} text-4xl text-slate-300 block mb-3`} />
          <p className="text-slate-400">No hay ítems en este catálogo.</p>
          <button onClick={openCreate} className="mt-4 text-blue-600 text-sm hover:underline">
            Agregar el primero →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Nombre</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium hidden md:table-cell">Descripción</th>
                {activeType === "modalities" && (
                  <th className="text-left px-6 py-3 text-slate-500 font-medium hidden md:table-cell">Ícono</th>
                )}
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Estado</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 text-slate-500 hidden md:table-cell max-w-xs truncate">
                    {item.description || "—"}
                  </td>
                  {activeType === "modalities" && (
                    <td className="px-6 py-4 hidden md:table-cell">
                      {item.icon ? <i className={`ti ${item.icon} text-blue-600 text-lg`} /> : "—"}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(item)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        item.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {item.is_active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <i className="ti ti-edit text-base" />
                      </button>
                      <button onClick={() => handleDelete(item)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <i className="ti ti-trash text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-medium text-slate-900 text-lg">
                {editing ? "Editar ítem" : `Agregar a ${activeTab?.label}`}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <i className="ti ti-x text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Cognitivo-Conductual"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descripción <span className="text-slate-400">(opcional)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Breve descripción del enfoque o modalidad..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {activeType === "modalities" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Ícono Tabler <span className="text-slate-400">(opcional, ej: ti-video)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      placeholder="ti-video"
                      className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.icon && <i className={`ti ${form.icon} text-blue-600 text-2xl`} />}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="is_active" className="text-sm text-slate-700">Activo (visible para terapeutas)</label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mt-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
