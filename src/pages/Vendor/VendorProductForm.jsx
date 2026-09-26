import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductApi } from "../../Api/productApi";
import { CategoryApi } from "../../Api/categoryApi";
import { resolveImage } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const emptyForm = {
  name: "", description: "", price: "", discountPrice: "", stock: "",
  categoryId: "", brand: "", paymentOptions: "cod", deliveryCharge: "60",
};

const VendorProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    CategoryApi.list().then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    ProductApi.myProducts({ limit: 100 }).then(({ data }) => {
      const product = data.data.find((p) => p._id === id);
      if (product) {
        setForm({
          name: product.name,
          description: product.description || "",
          price: product.price,
          discountPrice: product.discountPrice || "",
          stock: product.stock,
          categoryId: product.categoryId?._id || "",
          brand: product.brand || "",
          paymentOptions: product.paymentOptions,
          deliveryCharge: product.deliveryCharge,
        });
        setExistingImages(product.images || []);
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== undefined) fd.append(k, v);
      });
      images.forEach((file) => fd.append("images", file));

      if (isEdit) {
        await ProductApi.update(id, fd);
        toast.success("Product updated");
      } else {
        await ProductApi.create(fd);
        toast.success("Product created");
      }
      navigate("/vendor/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading product..." />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h1>

      <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300">
        <div className="card-body gap-3">
          <input placeholder="Product name" required className="input input-bordered w-full" value={form.name} onChange={update("name")} />
          <textarea placeholder="Description" rows={3} className="textarea textarea-bordered w-full" value={form.description} onChange={update("description")} />

          <div className="grid sm:grid-cols-2 gap-3">
            <input type="number" placeholder="Price" required min="0" className="input input-bordered w-full" value={form.price} onChange={update("price")} />
            <input type="number" placeholder="Discount price (optional)" min="0" className="input input-bordered w-full" value={form.discountPrice} onChange={update("discountPrice")} />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <input type="number" placeholder="Stock quantity" required min="0" className="input input-bordered w-full" value={form.stock} onChange={update("stock")} />
            <input type="number" placeholder="Delivery charge" min="0" className="input input-bordered w-full" value={form.deliveryCharge} onChange={update("deliveryCharge")} />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <select className="select select-bordered w-full" value={form.categoryId} onChange={update("categoryId")}>
              <option value="">No category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input placeholder="Brand (optional)" className="input input-bordered w-full" value={form.brand} onChange={update("brand")} />
          </div>

          <div>
            <p className="label-text text-sm mb-1">Accepted payment methods</p>
            <select className="select select-bordered w-full" value={form.paymentOptions} onChange={update("paymentOptions")}>
              <option value="cod">Cash on Delivery only</option>
              <option value="bkash">bKash only (coming soon — stored for later)</option>
              <option value="both">Both</option>
            </select>
          </div>

          {existingImages.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Current images</p>
              <div className="flex gap-2">
                {existingImages.map((img, i) => (
                  <img key={i} src={resolveImage(img)} className="w-14 h-14 rounded-lg object-cover" alt="" />
                ))}
              </div>
            </div>
          )}

          <label className="form-control">
            <span className="label-text text-sm mb-1">{isEdit ? "Add more images" : "Product images"} (up to 6)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="file-input file-input-bordered w-full"
              onChange={(e) => setImages(Array.from(e.target.files))}
            />
          </label>

          {error && <p className="text-error text-sm">{error}</p>}

          <button disabled={saving} className="btn btn-primary mt-2 rounded-full">
            {saving ? <span className="loading loading-spinner loading-sm" /> : isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorProductForm;
