import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminPage = () => {
  const [token, setToken] = useState("");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState({ new_orders: [], new_volunteers: [] });
  const [assignments, setAssignments] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name_fr: "",
    name_ar: "",
    price_mad: "",
    category: "Catalogue DXN",
    image: "",
    description_fr: "",
    description_ar: "",
    availability: true,
    status: "active"
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productQuery, setProductQuery] = useState("");
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message_fr: "",
    message_ar: "",
    rating: "5"
  });

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("dxn_admin_token") : "";
    if (stored) setToken(stored);
  }, []);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }),
    [token]
  );

  const uploadHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`
    }),
    [token]
  );

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    const fetchJson = async (url) => {
      const res = await fetch(url, { headers: authHeaders });
      if (!res.ok) {
        throw new Error(`API ${res.status}`);
      }
      return res.json();
    };
    try {
      const results = await Promise.allSettled([
        fetchJson(`${API_URL}/api/admin/products`),
        fetchJson(`${API_URL}/api/admin/testimonials`),
        fetchJson(`${API_URL}/api/admin/volunteers`),
        fetchJson(`${API_URL}/api/admin/orders`),
        fetchJson(`${API_URL}/api/admin/clients`),
        fetchJson(`${API_URL}/api/admin/stats`),
        fetchJson(`${API_URL}/api/admin/notifications`),
        fetchJson(`${API_URL}/api/admin/assignments`)
      ]);

      const getValue = (idx, fallback) =>
        results[idx].status === "fulfilled" ? results[idx].value : fallback;

      const p = getValue(0, []);
      const t = getValue(1, []);
      const v = getValue(2, []);
      const o = getValue(3, []);
      const c = getValue(4, []);
      const s = getValue(5, null);
      const n = getValue(6, { new_orders: [], new_volunteers: [] });
      const a = getValue(7, []);

      setProducts(Array.isArray(p) ? p : []);
      setTestimonials(Array.isArray(t) ? t : []);
      setVolunteers(Array.isArray(v) ? v : []);
      setOrders(Array.isArray(o) ? o : []);
      setClients(Array.isArray(c) ? c : []);
      setStats(s || null);
      setNotifications(
        n && typeof n === "object"
          ? {
              new_orders: Array.isArray(n.new_orders) ? n.new_orders : [],
              new_volunteers: Array.isArray(n.new_volunteers) ? n.new_volunteers : []
            }
          : { new_orders: [], new_volunteers: [] }
      );
      setAssignments(Array.isArray(a) ? a : []);

      if (results[0].status !== "fulfilled") {
        throw results[0].reason;
      }
    } catch (err) {
      setError("Impossible de charger les données admin. Vérifie que le backend tourne et reconnecte-toi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
      });
      if (!res.ok) throw new Error("login");
      const data = await res.json();
      setToken(data.token);
      window.localStorage.setItem("dxn_admin_token", data.token);
    } catch (err) {
      setError("Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    window.localStorage.removeItem("dxn_admin_token");
  };

  const handleCreateProduct = async () => {
    setError("");
    const payload = {
      ...newProduct,
      slug: slugify(newProduct.name_fr || newProduct.name_ar),
      price_mad: Number(newProduct.price_mad) || 0,
      image: newProduct.image || "",
      availability: newProduct.availability ? 1 : 0
    };
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("create");
      setNewProduct({
        name_fr: "",
        name_ar: "",
        price_mad: "",
        category: "Catalogue DXN",
        image: "",
        description_fr: "",
        description_ar: "",
        availability: true,
        status: "active"
      });
      fetchAll();
    } catch (err) {
      setError("Impossible de créer le produit.");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    setError("");
    const payload = {
      ...editingProduct,
      name_fr: editingProduct.name_fr || "",
      name_ar: editingProduct.name_ar || editingProduct.name_fr || "",
      slug: slugify(editingProduct.name_fr || editingProduct.name_ar || ""),
      price_mad: Number(editingProduct.price_mad) || 0,
      image: editingProduct.image || "",
      availability: editingProduct.availability ? 1 : 0
    };
    try {
      const res = await fetch(`${API_URL}/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("update");
      setEditingProduct(null);
      fetchAll();
    } catch (err) {
      setError("Impossible de modifier le produit.");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ status })
      });
      fetchAll();
    } catch (err) {
      setError("Impossible de modifier le statut.");
    }
  };

  const handleExport = async (format) => {
    if (!token) {
      setError("Session expirée. Reconnecte-toi.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/export/orders.${format}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Impossible d'exporter les commandes.");
    }
  };

  const handleUpdateVolunteerStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/admin/volunteers/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ status })
      });
      fetchAll();
    } catch (err) {
      setError("Impossible de modifier le volontaire.");
    }
  };

  const handleAssignVolunteer = async (volunteerId, orderId) => {
    try {
      await fetch(`${API_URL}/api/admin/assignments`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ volunteer_id: volunteerId, order_id: orderId })
      });
      fetchAll();
    } catch (err) {
      setError("Impossible d'assigner le volontaire.");
    }
  };

  const handleUpload = async (file, onSuccess) => {
    if (!file) return;
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: "POST",
        headers: uploadHeaders,
        body: formData
      });
      if (!res.ok) throw new Error("upload");
      const data = await res.json();
      onSuccess(`${API_URL}${data.url}`);
    } catch (err) {
      setError("Impossible d'importer l'image.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name_fr.toLowerCase().includes(productQuery.toLowerCase())
  );

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      fetchAll();
    } catch (err) {
      setError("Impossible de supprimer le produit.");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      fetchAll();
    } catch (err) {
      setError("Impossible de supprimer le témoignage.");
    }
  };

  const handleCreateTestimonial = async () => {
    setError("");
    const payload = {
      ...newTestimonial,
      rating: Number(newTestimonial.rating) || 5
    };
    try {
      const res = await fetch(`${API_URL}/api/admin/testimonials`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("create");
      setNewTestimonial({ name: "", message_fr: "", message_ar: "", rating: "5" });
      fetchAll();
    } catch (err) {
      setError("Impossible d'ajouter le témoignage.");
    }
  };

  const handleDeleteVolunteer = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/volunteers/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      fetchAll();
    } catch (err) {
      setError("Impossible de supprimer le volontaire.");
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      fetchAll();
    } catch (err) {
      setError("Impossible de supprimer la commande.");
    }
  };

  const handleToggleOrderItems = async (orderId) => {
    if (orderItems[orderId]) {
      setOrderItems((prev) => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/items`, {
        headers: authHeaders
      });
      const data = await res.json();
      setOrderItems((prev) => ({ ...prev, [orderId]: Array.isArray(data) ? data : [] }));
    } catch (err) {
      setError("Impossible de charger les produits de la commande.");
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-800">Admin DXN</h1>
        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Utilisateur"
            value={login.username}
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
          />
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Mot de passe"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full rounded-full bg-dxnGreen px-6 py-3 text-sm font-semibold text-white"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[1300px] gap-6 px-4 py-6">
        <aside className="hidden w-64 flex-shrink-0 rounded-2xl bg-slate-900 p-5 text-white lg:block">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo_logo3.png"
              alt="DXN"
              className="h-10 w-10 rounded-full bg-white p-1"
            />
            <div>
              <p className="text-sm text-white/70">DXN Admin</p>
              <p className="text-lg font-semibold">Dashboard</p>
            </div>
          </div>
          <nav className="mt-6 space-y-2 text-sm">
            <a href="#products" className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10">
              Produits
            </a>
            <a href="#testimonials" className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10">
              Témoignages
            </a>
            <a href="#volunteers" className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10">
              Volontaires
            </a>
            <a href="#orders" className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10">
              Commandes
            </a>
            <a href="#clients" className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10">
              Clients
            </a>
          </nav>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-dxnGreen to-dxnGold px-6 py-6 text-white shadow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold">Dashboard DXN</h1>
                <p className="text-sm text-white/80">Gestion e-commerce & WhatsApp</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/30"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {loading && <p className="mb-4 text-sm text-gray-500">Chargement...</p>}

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Produits</p>
              <p className="mt-2 text-2xl font-semibold text-dxnGreen">
                {stats?.total_products ?? products.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Témoignages</p>
              <p className="mt-2 text-2xl font-semibold text-dxnGreen">{testimonials.length}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Volontaires</p>
              <p className="mt-2 text-2xl font-semibold text-dxnGreen">
                {stats?.total_volunteers ?? volunteers.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Commandes</p>
              <p className="mt-2 text-2xl font-semibold text-dxnGreen">
                {stats?.total_orders ?? orders.length}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Total des ventes</p>
              <p className="mt-2 text-2xl font-semibold text-dxnGold">{stats?.total_sales ?? 0} DH</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Clients</p>
              <p className="mt-2 text-2xl font-semibold text-dxnGold">
                {stats?.total_clients ?? clients.length}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-400">Notifications</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Nouvelles commandes</p>
                {notifications.new_orders.length === 0 ? (
                  <p className="text-gray-500">Aucune</p>
                ) : (
                  notifications.new_orders.map((o) => (
                    <p key={o.id} className="text-gray-600">
                      #{o.id} • {o.customer_name} • {o.total_mad} DH
                    </p>
                  ))
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-700">Nouveaux volontaires</p>
                {notifications.new_volunteers.length === 0 ? (
                  <p className="text-gray-500">Aucun</p>
                ) : (
                  notifications.new_volunteers.map((v) => (
                    <p key={v.id} className="text-gray-600">
                      {v.name} • {v.city}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
      <section id="products" className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Ajouter un produit</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Nom FR"
            value={newProduct.name_fr}
            onChange={(e) => setNewProduct({ ...newProduct, name_fr: e.target.value })}
          />
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Nom AR"
            value={newProduct.name_ar}
            onChange={(e) => setNewProduct({ ...newProduct, name_ar: e.target.value })}
          />
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Prix (DH)"
            value={newProduct.price_mad}
            onChange={(e) => setNewProduct({ ...newProduct, price_mad: e.target.value })}
          />
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Catégorie"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={newProduct.status}
            onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={newProduct.availability}
              onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.checked })}
            />
            Disponible
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 md:col-span-2"
            placeholder="Image (URL)"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
          <textarea
            rows="3"
            className="w-full rounded-lg border px-3 py-2 md:col-span-2"
            placeholder="Description FR"
            value={newProduct.description_fr}
            onChange={(e) => setNewProduct({ ...newProduct, description_fr: e.target.value })}
          />
          <textarea
            rows="3"
            className="w-full rounded-lg border px-3 py-2 md:col-span-2"
            placeholder="Description AR"
            value={newProduct.description_ar}
            onChange={(e) => setNewProduct({ ...newProduct, description_ar: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full rounded-lg border px-3 py-2 md:col-span-2"
            onChange={(e) =>
              handleUpload(e.target.files?.[0], (url) =>
                setNewProduct({ ...newProduct, image: url })
              )
            }
          />
        </div>
        <button
          type="button"
          onClick={handleCreateProduct}
          className="mt-4 rounded-full bg-dxnGreen px-6 py-2 text-sm font-semibold text-white"
        >
          Ajouter
        </button>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Produits</h2>
        <input
          className="mt-3 w-full rounded-lg border px-3 py-2"
          placeholder="Rechercher un produit..."
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
        />
        <select
          className="mt-3 w-full rounded-lg border px-3 py-2"
          value={editingProduct?.id || ""}
          onChange={(e) => {
            const id = Number(e.target.value);
            const selected = products.find((p) => p.id === id);
            if (selected) setEditingProduct(selected);
          }}
        >
          <option value="">Choisir un produit à modifier...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name_fr} ({product.price_mad} DH)
            </option>
          ))}
        </select>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2">Produit</th>
                <th className="px-3 py-2">Prix</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Image</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="px-3 py-2">
                    <p className="font-semibold">{product.name_fr}</p>
                    <p className="text-xs text-gray-400">{product.category}</p>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{product.price_mad} DH</td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {product.status === "inactive" ? "Inactif" : "Actif"} •{" "}
                    {product.availability ? "Disponible" : "Indisponible"}
                  </td>
                  <td className="px-3 py-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name_fr}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="rounded-full border px-3 py-1 text-xs text-dxnGreen"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="rounded-full border px-3 py-1 text-xs text-red-500"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editingProduct && (
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Modifier le produit</h2>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="text-sm text-gray-500"
            >
              Annuler
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Nom FR"
              value={editingProduct.name_fr}
              onChange={(e) => setEditingProduct({ ...editingProduct, name_fr: e.target.value })}
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Nom AR"
              value={editingProduct.name_ar}
              onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Prix (DH)"
              value={editingProduct.price_mad}
              onChange={(e) => setEditingProduct({ ...editingProduct, price_mad: e.target.value })}
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Catégorie"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
            />
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={editingProduct.status || "active"}
              onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={Boolean(editingProduct.availability)}
                onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.checked })}
              />
              Disponible
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 md:col-span-2"
              placeholder="Image (URL)"
              value={editingProduct.image || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
            />
            <textarea
              rows="3"
              className="w-full rounded-lg border px-3 py-2 md:col-span-2"
              placeholder="Description FR"
              value={editingProduct.description_fr || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, description_fr: e.target.value })}
            />
            <textarea
              rows="3"
              className="w-full rounded-lg border px-3 py-2 md:col-span-2"
              placeholder="Description AR"
              value={editingProduct.description_ar || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border px-3 py-2 md:col-span-2"
              onChange={(e) =>
                handleUpload(e.target.files?.[0], (url) =>
                  setEditingProduct({ ...editingProduct, image: url })
                )
              }
            />
          </div>
          <button
            type="button"
            onClick={handleUpdateProduct}
            className="mt-4 rounded-full bg-dxnGreen px-6 py-2 text-sm font-semibold text-white"
          >
            Enregistrer
          </button>
        </section>
      )}

      <section id="testimonials" className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Témoignages</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Nom"
            value={newTestimonial.name}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
          />
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Note (1-5)"
            value={newTestimonial.rating}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: e.target.value })}
          />
          <textarea
            rows="3"
            className="w-full rounded-lg border px-3 py-2 md:col-span-2"
            placeholder="Message FR"
            value={newTestimonial.message_fr}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, message_fr: e.target.value })}
          />
          <textarea
            rows="3"
            className="w-full rounded-lg border px-3 py-2 md:col-span-2"
            placeholder="Message AR"
            value={newTestimonial.message_ar}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, message_ar: e.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={handleCreateTestimonial}
          className="mt-4 rounded-full bg-dxnGreen px-6 py-2 text-sm font-semibold text-white"
        >
          Ajouter
        </button>
        <div className="mt-4 space-y-2">
          {testimonials.map((item) => (
            <div key={item.id} className="flex items-start justify-between border-b pb-2 text-sm">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.message_fr}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteTestimonial(item.id)}
                className="text-red-500"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="volunteers" className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Volontaires</h2>
        <div className="mt-4 space-y-2 text-sm">
          {volunteers.map((item) => (
            <div key={item.id} className="flex items-start justify-between border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.city} • {item.phone}</p>
                <p className="text-gray-500">{item.motivation}</p>
                <p className="text-xs text-gray-400">
                  {item.availability || "Disponibilité inconnue"} • {item.status}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  className="rounded-lg border px-2 py-1 text-xs"
                  value={item.status || "active"}
                  onChange={(e) => handleUpdateVolunteerStatus(item.id, e.target.value)}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteVolunteer(item.id)}
                  className="text-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="orders" className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Commandes</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            onClick={() => handleExport("csv")}
            className="rounded-full border px-4 py-2"
          >
            Export Excel (CSV)
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            className="rounded-full border px-4 py-2"
          >
            Export PDF
          </button>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          {orders.map((item) => (
            <div key={item.id} className="flex items-start justify-between border-b pb-2">
              <div>
                <p className="font-semibold">{item.customer_name}</p>
                <p className="text-gray-500">
                  {item.city} • {item.phone} • {item.total_mad} DH
                </p>
                <p className="text-gray-500">{item.address}</p>
                <p className="text-xs text-gray-400">
                  {item.platform || "DXN"} • {item.status}
                </p>
                {orderItems[item.id] && (
                  <div className="mt-2 rounded-md bg-gray-50 p-2 text-xs text-gray-600">
                    {orderItems[item.id].map((line) => (
                      <p key={line.id}>
                        {line.product_name} x{line.quantity} • {line.price_mad} DH
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <select
                  className="rounded-lg border px-2 py-1 text-xs"
                  value={item.status}
                  onChange={(e) => handleUpdateOrderStatus(item.id, e.target.value)}
                >
                  <option value="new">Nouveau</option>
                  <option value="processing">En traitement</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
                <select
                  className="rounded-lg border px-2 py-1 text-xs"
                  defaultValue=""
                  onChange={(e) => {
                    const volunteerId = Number(e.target.value);
                    if (volunteerId) handleAssignVolunteer(volunteerId, item.id);
                  }}
                >
                  <option value="">Assigner volontaire</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                {item.phone && (
                  <a
                    className="text-green-600"
                    href={`https://wa.me/${item.phone}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Répondre WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleToggleOrderItems(item.id)}
                  className="text-dxnGreen"
                >
                  {orderItems[item.id] ? "Masquer" : "Voir produits"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(item.id)}
                  className="text-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="clients" className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Clients</h2>
        <div className="mt-4 space-y-2 text-sm">
          {clients.map((client) => (
            <div key={client.id} className="flex items-start justify-between border-b pb-2">
              <div>
                <p className="font-semibold">{client.name}</p>
                <p className="text-gray-500">
                  {client.whatsapp_phone} • {client.city} • {client.platform || "DXN"}
                </p>
                <p className="text-xs text-gray-400">
                  Commandes: {client.orders_count} • Total: {client.total_spent} DH
                </p>
              </div>
              {client.whatsapp_phone && (
                <a
                  className="text-green-600"
                  href={`https://wa.me/${client.whatsapp_phone}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
          </div>
          </div>
        </div>
      </div>
  );
};

export default AdminPage;
