const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const backToTop = document.getElementById("backToTop");
const imageCards = document.querySelectorAll(".image-card img");
const revealItems = document.querySelectorAll(".reveal");

imageCards.forEach((img) => {
  img.addEventListener("click", () => {
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });
});

function closeModal() {
  modal.classList.remove("show");
  modalImage.src = "";
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealItems.forEach((item) => {
  observer.observe(item);
});

/* =========================
   記事の検索・絞り込み
========================= */

const articleSearch = document.getElementById("articleSearch");

const categoryFilterButtons =
  document.querySelectorAll(".filter-btn");

const subFilterButtons =
  document.querySelectorAll(".sub-filter-btn");

const resetFiltersButton =
  document.getElementById("resetFilters");

const resultCount =
  document.getElementById("resultCount");

const articleCards =
  document.querySelectorAll(".image-card");

const categorySections =
  document.querySelectorAll(".category-section");

let selectedCategory = "all";
let selectedTag = "all";

/* 全角・半角やスペースの違いを減らす */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .normalize("NFKC");
}

/* カードを条件に合わせて表示・非表示にする */
function filterArticles() {
  const keyword = normalizeText(articleSearch.value);

  let visibleCount = 0;

  articleCards.forEach((card) => {
    const cardCategory = card.dataset.category;

    const cardTags = card.dataset.tags
      ? card.dataset.tags.split(" ")
      : [];

    const titleElement = card.querySelector("h3");
    const imageElement = card.querySelector("img");

    const title = titleElement
      ? normalizeText(titleElement.textContent)
      : "";

    const altText = imageElement
      ? normalizeText(imageElement.alt)
      : "";

    const categoryMatches =
      selectedCategory === "all" ||
      cardCategory === selectedCategory;

    const tagMatches =
      selectedTag === "all" ||
      cardTags.includes(selectedTag);

    const keywordMatches =
      keyword === "" ||
      title.includes(keyword) ||
      altText.includes(keyword);

    const shouldShow =
      categoryMatches &&
      tagMatches &&
      keywordMatches;

    card.classList.toggle(
      "is-hidden",
      !shouldShow
    );

    if (shouldShow) {
      visibleCount++;
    }
  });

  /* 記事が1件も残っていないカテゴリは非表示 */
  categorySections.forEach((section) => {
    const visibleCards = section.querySelectorAll(
      ".image-card:not(.is-hidden)"
    );

    section.classList.toggle(
      "is-hidden",
      visibleCards.length === 0
    );
  });

  if (visibleCount === 0) {
    resultCount.textContent =
      "該当する記事がありません";
  } else {
    resultCount.textContent =
      `${visibleCount}件の記事が見つかりました`;
  }
}

/* 大分類ボタン */
categoryFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryFilterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    selectedCategory =
      button.dataset.category;

    filterArticles();
  });
});

/* 小分類ボタン */
subFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    subFilterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    selectedTag =
      button.dataset.tag;

    filterArticles();
  });
});

/* キーワード入力 */
articleSearch.addEventListener(
  "input",
  filterArticles
);

/* 条件リセット */
resetFiltersButton.addEventListener(
  "click",
  () => {
    selectedCategory = "all";
    selectedTag = "all";

    articleSearch.value = "";

    categoryFilterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.category === "all"
      );
    });

    subFilterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.tag === "all"
      );
    });

    filterArticles();
  }
);

/* 初期表示 */
filterArticles();
