import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const isRu = typeof window !== "undefined" && localStorage.getItem("am_lang") === '"ru"';

      return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6 text-[#1e293b] font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-150 p-6 sm:p-8 text-center animate-modal-pop">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-3xl bg-red-50 text-[#e5252b] flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-xs">
              <span className="material-symbols-rounded text-4xl">warning</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {isRu ? "Что-то пошло не так" : "Kutilmagan xatolik yuz berdi"}
            </h1>

            <p className="text-gray-500 text-[13.5px] mt-2 leading-relaxed">
              {isRu
                ? "Произошла временная ошибка в работе страницы. Не волнуйтесь, ваши данные и корзина в безопасности."
                : "Sahifada vaqtinchalik nosozlik yuz berdi. Xavotir olmang, ma'lumotlaringiz va savatingiz xavfsiz saqlangan."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#e5252b] to-[#c81a20] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:brightness-105 active:scale-95 transition cursor-pointer"
              >
                <span className="material-symbols-rounded text-[18px]">refresh</span>
                <span>{isRu ? "Перезагрузить" : "Qayta yuklash"}</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
              >
                <span className="material-symbols-rounded text-[18px]">home</span>
                <span>{isRu ? "На главную" : "Bosh sahifa"}</span>
              </button>
            </div>

            {/* Technical details (collapsed by default) */}
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className="mt-5 text-left border-t border-gray-100 pt-3">
                <summary className="text-[11px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer select-none">
                  Texnik tafsilotlar (Tuzatish uchun)
                </summary>
                <pre className="mt-2 p-3 bg-gray-950 text-red-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 whitespace-pre-wrap">
                  {String(this.state.error?.stack || this.state.error)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
