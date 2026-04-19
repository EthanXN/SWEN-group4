import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch all categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/categories", {
      credentials: "include",
    });
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async () => {
    if (editingId) {
      // UPDATE
      const res = await fetch(
        `http://localhost:8080/categories/${editingId}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        setMessage("Category updated successfully!");
        resetForm();
        fetchCategories();
      }
    } else {
      // ADD NEW
      const res = await fetch("http://localhost:8080/categories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage("Category added successfully!");
        resetForm();
        fetchCategories();
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description });
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(
      `http://localhost:8080/categories/${id}/delete`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (res.ok) {
      setMessage("Category deleted successfully!");
      fetchCategories();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Categories</h1>

      {/* Success Message */}
      {message && (
        <div style={{
          background: "#d4edda", color: "#155724",
          padding: "1rem", borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          {message}
        </div>
      )}

      {/* Add New Button */}
      <button
        onClick={() => { setShowForm(true); setMessage(""); }}
        style={{
          background: "#e8400c", color: "white",
          padding: "0.5rem 1rem", border: "none",
          borderRadius: "6px", cursor: "pointer",
          marginBottom: "1rem"
        }}
      >
        + Add New Category
      </button>

      {/* Form View */}
      {showForm && (
        <div style={{
          background: "#f9f9f9", padding: "1.5rem",
          borderRadius: "8px", marginBottom: "2rem",
          border: "1px solid #ddd"
        }}>
          <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>

          <div style={{ marginBottom: "1rem" }}>
            <label>Name:</label><br />
            <input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Description:</label><br />
            <input
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              background: "#e8400c", color: "white",
              padding: "0.5rem 1.5rem", border: "none",
              borderRadius: "6px", cursor: "pointer",
              marginRight: "1rem"
            }}
          >
            {editingId ? "Update Category" : "Add Category"}
          </button>

          <button
            onClick={resetForm}
            style={{
              background: "#ccc", padding: "0.5rem 1.5rem",
              border: "none", borderRadius: "6px", cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Table View */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Description</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td style={td}>{cat.id}</td>
              <td style={td}>{cat.name}</td>
              <td style={td}>{cat.description}</td>
              <td style={td}>
                <button
                  onClick={() => handleEdit(cat)}
                  style={{
                    background: "#007bff", color: "white",
                    border: "none", padding: "0.3rem 0.8rem",
                    borderRadius: "4px", cursor: "pointer",
                    marginRight: "0.5rem"
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{
                    background: "#dc3545", color: "white",
                    border: "none", padding: "0.3rem 0.8rem",
                    borderRadius: "4px", cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "0.75rem", textAlign: "left",
  borderBottom: "2px solid #ddd"
};

const td: React.CSSProperties = {
  padding: "0.75rem",
  borderBottom: "1px solid #eee"
};