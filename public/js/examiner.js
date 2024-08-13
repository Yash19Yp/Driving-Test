document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterForm");

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const testType = document.getElementById("testType").value;
    const url = new URL(window.location.href);
    url.searchParams.set("testType", testType);

    window.location.href = url.toString();
  });
});
