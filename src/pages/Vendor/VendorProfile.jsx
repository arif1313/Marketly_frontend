import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VendorApi } from "../../Api/vendorApi";
import { useAuth } from "../Auth/AuthContext";
import { resolveImage } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const VendorProfile = () => {
  const { vendor: authVendor } = useAuth();
  const [form, setForm] = useState({ shopName: "", brandName: "", description: "", address: "", contactNumber: "" });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    VendorApi.myShop().then(({ data }) => {
      const v = data.data;
      setCurrentVendor(v);
      setForm({
        shopName: v.shopName || "",
        brandName: v.brandName || "",
        description: v.description || "",
        address: v.address || "",
        contactNumber: v.contactNumber || "",
      });
      setLoading(false);
    });
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (logo) fd.append("logo", logo);
      if (banner) fd.append("banner", banner);

      const { data } = await VendorApi.updateMyShop(fd);
      setCurrentVendor(data.data);
      toast.success("Shop profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading shop profile..." />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Shop Profile</h1>

      <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300">
        <div className="card-body gap-3">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-base-200 overflow-hidden flex items-center justify-center">
              {currentVendor?.logo && <img src={resolveImage(currentVendor.logo)} className="w-full h-full object-cover" alt="" />}
            </div>
            <label className="form-control flex-1">
              <span className="label-text text-sm mb-1">Shop logo</span>
              <input type="file" accept="image/*" className="file-input file-input-bordered file-input-sm w-full" onChange={(e) => setLogo(e.target.files[0])} />
            </label>
          </div>

          <label className="form-control">
            <span className="label-text text-sm mb-1">Shop banner (optional)</span>
            <input type="file" accept="image/*" className="file-input file-input-bordered file-input-sm w-full" onChange={(e) => setBanner(e.target.files[0])} />
          </label>

          <input placeholder="Shop name" required className="input input-bordered w-full" value={form.shopName} onChange={update("shopName")} />
          <input placeholder="Brand name" className="input input-bordered w-full" value={form.brandName} onChange={update("brandName")} />
          <textarea placeholder="Shop description" rows={3} className="textarea textarea-bordered w-full" value={form.description} onChange={update("description")} />
          <input placeholder="Address" className="input input-bordered w-full" value={form.address} onChange={update("address")} />
          <input placeholder="Contact number" className="input input-bordered w-full" value={form.contactNumber} onChange={update("contactNumber")} />

          <button disabled={saving} className="btn btn-primary mt-2 rounded-full self-start px-6">
            {saving ? <span className="loading loading-spinner loading-sm" /> : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorProfile;
