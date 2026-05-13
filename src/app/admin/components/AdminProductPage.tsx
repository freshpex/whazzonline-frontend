import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { useAuth } from '../../auth/hooks/useAuth';
import { createUser } from '../../auth/services/auth.service';
import type { AuthRole } from '../../auth/types/auth';
import { createProduct } from '../../products/services/product.service';
import type { ProductCreateInput } from '../../products/types/product';

const PRODUCT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Home Office', 'Kitchen', 'Beauty', 'Groceries'] as const;
const CUSTOM_CATEGORY_VALUE = '__custom__';

const initialProductForm: ProductCreateInput = {
  name: '',
  price: 0,
  description: '',
  imageUrl: '',
  category: '',
  stock: 0
};

function formatPriceValue(value: string) {
  const digits = value.replace(/[^\d]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-NG');
}

export function AdminProductPage() {
  const { user } = useAuth();
  const [productForm, setProductForm] = useState<ProductCreateInput>(initialProductForm);
  const [priceInput, setPriceInput] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<AuthRole>('vendor');
  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const isCustomCategory = selectedCategory === CUSTOM_CATEGORY_VALUE;
  const resolvedCategory = useMemo(
    () => (isCustomCategory ? customCategory.trim() : selectedCategory.trim()),
    [isCustomCategory, customCategory, selectedCategory]
  );

  async function handleProductSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!productForm.name.trim() || !productForm.description.trim() || !resolvedCategory || !productForm.imageUrl.trim()) {
      setError('Please complete all product fields before saving.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: ProductCreateInput = {
        ...productForm,
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        category: resolvedCategory,
        imageUrl: productForm.imageUrl.trim()
      };
      const product = await createProduct(payload);
      setSuccess(`${product.name} has been created.`);
      setProductForm(initialProductForm);
      setPriceInput('0');
      setSelectedCategory('');
      setCustomCategory('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create product.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUserError(null);
    setUserSuccess(null);

    if (!userEmail.trim() && !userPhone.trim()) {
      setUserError('Enter an email or phone number for the new user.');
      return;
    }

    try {
      setIsCreatingUser(true);
      const created = await createUser({
        email: userEmail.trim() || undefined,
        phone: userPhone.trim() || undefined,
        password: userPassword,
        role: newUserRole
      });
      setUserSuccess(`User created successfully as ${created.role}.`);
      setUserEmail('');
      setUserPhone('');
      setUserPassword('');
      setNewUserRole('vendor');
    } catch (err) {
      setUserError(err instanceof Error ? err.message : 'Unable to create user.');
    } finally {
      setIsCreatingUser(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Add a product</h1>
        <p className="mt-2 text-sm text-slate-600">Create a new product listing for the storefront.</p>
        <Link to="/" className="mt-3 inline-flex text-sm font-semibold text-slate-700">
          Back to products
        </Link>
      </div>

      {error ? <InlineAlert title={error} tone="error" /> : null}
      {success ? <InlineAlert title={success} tone="success" /> : null}
      {uploadNotice ? <InlineAlert title={uploadNotice} tone="info" /> : null}

      <form onSubmit={handleProductSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Product name</label>
            <input
              value={productForm.name}
              onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Wireless Headphones"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <select
              value={selectedCategory}
              onChange={(event) => {
                setSelectedCategory(event.target.value);
                if (event.target.value !== CUSTOM_CATEGORY_VALUE) setCustomCategory('');
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Select a category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value={CUSTOM_CATEGORY_VALUE}>Other (type your own)</option>
            </select>
          </div>
        </div>

        {isCustomCategory ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold">Custom category</label>
            <input
              value={customCategory}
              onChange={(event) => setCustomCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Type category name"
            />
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (NGN)</label>
            <input
              inputMode="numeric"
              value={priceInput}
              onChange={(event) => {
                const formatted = formatPriceValue(event.target.value);
                const amount = Number(formatted.replace(/,/g, '')) || 0;
                setPriceInput(formatted);
                setProductForm((prev) => ({ ...prev, price: amount }));
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Stock</label>
            <input
              type="number"
              min={0}
              value={productForm.stock}
              onChange={(event) => setProductForm((prev) => ({ ...prev, stock: Math.max(0, Number(event.target.value) || 0) }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Image URL</label>
          <input
            value={productForm.imageUrl}
            onChange={(event) => setProductForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="https://images.unsplash.com/..."
          />
          <button
            type="button"
            onClick={() => setUploadNotice('Image upload is coming soon. Please use an image URL for now.')}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
          >
            Upload image
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Description</label>
          <textarea
            value={productForm.description}
            onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
            className="min-h-[120px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Saving...' : 'Create product'}
        </button>
      </form>

      {user?.role === 'admin' ? (
        <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold">Create users</h2>
            <p className="mt-1 text-sm text-slate-600">Admins can add vendor, customer, or admin accounts.</p>
          </div>

          {userError ? <InlineAlert title={userError} tone="error" /> : null}
          {userSuccess ? <InlineAlert title={userSuccess} tone="success" /> : null}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="new-user@whazzonline.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone number</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(event) => setUserPhone(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="+2348012345678"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(event) => setUserPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Role</label>
                <select
                  value={newUserRole}
                  onChange={(event) => setNewUserRole(event.target.value as AuthRole)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="vendor">Vendor</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreatingUser}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingUser ? 'Creating user...' : 'Create user'}
            </button>
          </form>
        </section>
      ) : null}
    </section>
  );
}
