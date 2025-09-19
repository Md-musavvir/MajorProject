import { useEffect, useState } from "react";

import axios from "axios";
import { BookOpen, Edit, Filter, Plus, Sparkles, Trash2 } from "lucide-react";

function BookAdminDashboard() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [books, setBooks] = useState([]);
  const [FetchError, setFetchError] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  const token = localStorage.getItem("accessToken");

  const handleImage = (e, type) => {
    if (type === "image") setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "https://majorproject-d54u.onrender.com/api/v1/admin/addBook",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage(
          response.data.message || "✅ Book added successfully!"
        );
        setError("");
        setTitle("");
        setAuthor("");
        setPrice(0);
        setCategory("");
        setImage(null);
        if (selectedCategory) fetchBooks(selectedCategory);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("❌ No server response");
      }
      setSuccessMessage("");
    }
  };

  const fetchBooks = async (categoryName) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://majorproject-d54u.onrender.com/api/v1/admin/getBooks/${categoryName.toLowerCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setBooks(response.data.data || []);
    } catch (err) {
      if (err.response) {
        setBooks([]);
        setFetchError(err.response);
      } else {
        console.error(err);
        setBooks([]);
      }
    }
  };

  useEffect(() => {
    if (selectedCategory) fetchBooks(selectedCategory);
  }, [selectedCategory]);

  const startEditing = (book) => setEditingBook({ ...book });

  const handleUpdate = async (e, bookId) => {
    e.preventDefault();
    try {
      const updatedData = {
        title: editingBook.title,
        author: editingBook.author,
        price: editingBook.price,
        category: editingBook.category,
      };

      const response = await axios.put(
        `https://majorproject-d54u.onrender.com/api/v1/admin/updateBook/${bookId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSuccessMessage(
          response.data.message || "✅ Book updated successfully!"
        );
        setError("");
        setEditingBook(null);
        if (selectedCategory) fetchBooks(selectedCategory);
      }
    } catch (error) {
      if (error.response)
        setError(error.response.data.message || "❌ Error updating book");
      else setError("❌ No server response");
      setSuccessMessage("");
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(
        `https://majorproject-d54u.onrender.com/api/v1/admin/deleteBook/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("✅ Book deleted successfully!");
      if (selectedCategory) fetchBooks(selectedCategory);
    } catch (error) {
      if (error.response)
        setError(error.response.data.message || "❌ Error deleting book");
      else setError("❌ No server response");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 p-8 space-y-16">
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/20 rounded-full backdrop-blur-xl">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold text-lg">
              ReadHorizon Admin Dashboard
            </span>
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text drop-shadow-2xl">
            Book Management Matrix
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="max-w-2xl mx-auto"
        >
          <div className="bg-black/40 backdrop-blur-2xl border border-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-10 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text">
                INJECT NEW BOOK
              </h2>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-400/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                  <span className="text-emerald-300 font-medium">
                    {successMessage}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-900/40 to-rose-900/40 border border-red-400/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                  <span className="text-red-300 font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Title Matrix
                </label>
                <input
                  type="text"
                  placeholder="Enter book title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none placeholder-slate-500 text-white transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                  Author Entity
                </label>
                <input
                  type="text"
                  placeholder="Enter author name..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none placeholder-slate-500 text-white transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Price Vector
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 text-white transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                  Category Nexus
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-white transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/50"
                >
                  <option value="" className="bg-slate-900">
                    Select Category
                  </option>
                  <option value="fiction" className="bg-slate-900">
                    Fiction
                  </option>
                  <option value="fantasy" className="bg-slate-900">
                    Fantasy
                  </option>
                  <option value="science" className="bg-slate-900">
                    Science
                  </option>
                  <option value="non-fiction" className="bg-slate-900">
                    Non-fiction
                  </option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-pink-400 uppercase tracking-widest">
                  Visual Asset
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => handleImage(e, "image")}
                    accept="image/*"
                    className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-slate-300 transition-all duration-300 backdrop-blur-sm hover:bg-slate-800/50 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-600 file:to-purple-600 file:text-white hover:file:from-pink-700 hover:file:to-purple-700 file:transition-all file:duration-300"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl font-black text-white text-lg tracking-widest uppercase shadow-2xl hover:shadow-purple-500/30 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Initialize Book Upload</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </form>

        <div className="max-w-7xl mx-auto">
          <div className="bg-black/40 backdrop-blur-2xl border border-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                  BOOK REGISTRY SCANNER
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Filter Matrix
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white transition-all duration-300 backdrop-blur-sm min-w-[200px]"
                >
                  <option value="" className="bg-slate-900">
                    All Categories
                  </option>
                  <option value="fiction" className="bg-slate-900">
                    Fiction
                  </option>
                  <option value="fantasy" className="bg-slate-900">
                    Fantasy
                  </option>
                  <option value="science" className="bg-slate-900">
                    Science
                  </option>
                  <option value="non-fiction" className="bg-slate-900">
                    Non-fiction
                  </option>
                </select>
              </div>
            </div>

            {books.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-700/30">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
                        <th className="py-6 px-8 text-left text-xs font-black text-cyan-400 uppercase tracking-widest">
                          Title Vector
                        </th>
                        <th className="py-6 px-8 text-left text-xs font-black text-purple-400 uppercase tracking-widest">
                          Author Entity
                        </th>
                        <th className="py-6 px-8 text-left text-xs font-black text-emerald-400 uppercase tracking-widest">
                          Price Matrix
                        </th>
                        <th className="py-6 px-8 text-left text-xs font-black text-orange-400 uppercase tracking-widest">
                          Category Nexus
                        </th>
                        <th className="py-6 px-8 text-center text-xs font-black text-pink-400 uppercase tracking-widest">
                          Action Protocol
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {books.map((book, index) => (
                        <tr
                          key={book._id}
                          className="group hover:bg-gradient-to-r hover:from-slate-800/30 hover:to-slate-700/30 transition-all duration-300"
                        >
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                              <span className="text-white font-medium group-hover:text-cyan-300 transition-colors duration-300">
                                {book.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-8 text-slate-300 group-hover:text-purple-300 transition-colors duration-300">
                            {book.author}
                          </td>
                          <td className="py-6 px-8">
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-500/20 rounded-full text-emerald-300 font-bold text-sm">
                              ${book.price}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-900/40 to-amber-900/40 border border-orange-500/20 rounded-full text-orange-300 font-medium text-sm capitalize">
                              {book.category}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => startEditing(book)}
                                className="p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 group/btn"
                              >
                                <Edit className="w-5 h-5 text-blue-400 group-hover/btn:text-blue-300 group-hover/btn:scale-110 transition-all duration-300" />
                              </button>
                              <button
                                onClick={() => handleDelete(book._id)}
                                className="p-3 bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/30 rounded-xl hover:from-red-500/30 hover:to-rose-500/30 transition-all duration-300 group/btn"
                              >
                                <Trash2 className="w-5 h-5 text-red-400 group-hover/btn:text-red-300 group-hover/btn:scale-110 transition-all duration-300" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : selectedCategory ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/40 border border-slate-600/30 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 font-medium">
                    {FetchError?.message ||
                      "No books detected in this category nexus"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/40 border border-slate-600/30 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 font-medium">
                    Select a category to initialize book scan
                  </span>
                </div>
              </div>
            )}

            {editingBook && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="max-w-2xl w-full bg-black/90 backdrop-blur-2xl border border-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
                      MODIFY BOOK MATRIX
                    </h3>
                  </div>

                  <form
                    onSubmit={(e) => handleUpdate(e, editingBook._id)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editingBook.title}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none text-white transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                          Author
                        </label>
                        <input
                          type="text"
                          value={editingBook.author}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              author: e.target.value,
                            })
                          }
                          className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                          Price
                        </label>
                        <input
                          type="number"
                          value={editingBook.price}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              price: e.target.value,
                            })
                          }
                          className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-white transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                          Category
                        </label>
                        <select
                          value={editingBook.category}
                          onChange={(e) =>
                            setEditingBook({
                              ...editingBook,
                              category: e.target.value,
                            })
                          }
                          className="w-full p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-white transition-all duration-300 backdrop-blur-sm"
                        >
                          <option value="" className="bg-slate-900">
                            Select Category
                          </option>
                          <option value="fiction" className="bg-slate-900">
                            Fiction
                          </option>
                          <option value="fantasy" className="bg-slate-900">
                            Fantasy
                          </option>
                          <option value="science" className="bg-slate-900">
                            Science
                          </option>
                          <option value="non-fiction" className="bg-slate-900">
                            Non-fiction
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-white uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/30"
                      >
                        Execute Update
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBook(null)}
                        className="flex-1 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 rounded-2xl font-bold text-white uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      >
                        Abort Mission
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default BookAdminDashboard;
