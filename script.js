/* =========================================================
   LUCKEY SHOES STORE
   PART 8 — COMPLETE SCRIPT.JS
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

const $ = (selector) =>
  document.querySelector(selector);

const $$ = (selector) =>
  document.querySelectorAll(selector);


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(message) {

  let toast = $("#luckeyToast");

  if (!toast) {

    toast = document.createElement("div");

    toast.id = "luckeyToast";

    toast.style.cssText = `
      position:fixed;
      left:50%;
      bottom:25px;
      transform:translateX(-50%);
      background:#111;
      color:#fff;
      padding:13px 20px;
      border-radius:999px;
      font-size:14px;
      font-weight:700;
      z-index:99999;
      box-shadow:0 10px 30px rgba(0,0,0,.2);
      opacity:0;
      transition:.3s ease;
      pointer-events:none;
    `;

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.style.opacity = "1";

  clearTimeout(window.luckeyToastTimer);

  window.luckeyToastTimer =
    setTimeout(() => {

      toast.style.opacity = "0";

    }, 2500);
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuToggle =
  $(".menu-toggle");

const nav =
  $("#nav");


if (menuToggle && nav) {

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        nav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.textContent =
        isOpen ? "✕" : "☰";

    }
  );


  $$(".nav a").forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        nav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.textContent = "☰";

      }
    );

  });

}


/* =========================================================
   CART
   ========================================================= */

let cart = [];

try {

  cart =
    JSON.parse(
      localStorage.getItem(
        "luckeyCart"
      )
    ) || [];

} catch (error) {

  cart = [];

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

  localStorage.setItem(
    "luckeyCart",
    JSON.stringify(cart)
  );

}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

  const countElement =
    $("#cartCount");

  if (!countElement) return;

  const totalItems =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  countElement.textContent =
    totalItems;

}


/* =========================================================
   ADD PRODUCT TO CART
   ========================================================= */

$$(".add-cart").forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const name =
        button.dataset.name;

      const price =
        button.dataset.price;


      const existing =
        cart.find(
          (item) =>
            item.name === name
        );


      if (existing) {

        existing.quantity += 1;

      } else {

        cart.push({

          name: name,

          price: price,

          quantity: 1

        });

      }


      saveCart();

      updateCartCount();


      button.textContent =
        "Added ✓";


      showToast(
        `${name} added to cart`
      );


      setTimeout(() => {

        button.textContent =
          "Add to Cart";

      }, 1200);

    }
  );

});


/* =========================================================
   CART PANEL
   ========================================================= */

function createCartPanel() {

  if ($("#luckeyCartPanel")) return;


  const panel =
    document.createElement("div");

  panel.id =
    "luckeyCartPanel";


  panel.innerHTML = `

    <div class="luckey-cart-overlay"></div>

    <aside class="luckey-cart">

      <div class="luckey-cart-header">

        <h2>Your Cart</h2>

        <button
          type="button"
          id="closeLuckeyCart"
          aria-label="Close cart">

          ✕

        </button>

      </div>


      <div
        id="luckeyCartItems"
        class="luckey-cart-items">
      </div>


      <div class="luckey-cart-footer">

        <div class="luckey-cart-total">

          <span>
            Total
          </span>

          <strong id="luckeyCartTotal">
            ₹0
          </strong>

        </div>


        <button
          type="button"
          id="whatsappCheckout"
          class="btn primary">

          Order on WhatsApp

        </button>


        <button
          type="button"
          id="clearLuckeyCart"
          class="luckey-clear-cart">

          Clear Cart

        </button>

      </div>

    </aside>

  `;


  document.body.appendChild(panel);


  $("#closeLuckeyCart")
    .addEventListener(
      "click",
      closeCart
    );


  $(".luckey-cart-overlay")
    .addEventListener(
      "click",
      closeCart
    );


  $("#clearLuckeyCart")
    .addEventListener(
      "click",
      clearCart
    );


  $("#whatsappCheckout")
    .addEventListener(
      "click",
      checkoutWhatsApp
    );

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

  createCartPanel();


  const container =
    $("#luckeyCartItems");

  const totalElement =
    $("#luckeyCartTotal");


  if (!container) return;


  if (cart.length === 0) {

    container.innerHTML = `

      <div class="empty-cart">

        <div class="empty-cart-icon">
          👟
        </div>

        <h3>
          Your cart is empty
        </h3>

        <p>
          Add some shoes and they
          will appear here.
        </p>

      </div>

    `;

    if (totalElement) {
      totalElement.textContent =
        "₹0";
    }

    return;
  }


  let total = 0;


  container.innerHTML =
    cart.map(
      (item, index) => {

        const numericPrice =
          Number(
            String(item.price)
              .replace(/[^\d.]/g, "")
          ) || 0;


        total +=
          numericPrice *
          item.quantity;


        return `

          <div
            class="cart-item">

            <div>

              <strong>
                ${escapeHTML(item.name)}
              </strong>

              <small>
                ${escapeHTML(item.price)}
              </small>

            </div>


            <div class="cart-item-actions">

              <button
                type="button"
                data-cart-action="minus"
                data-index="${index}">

                −

              </button>


              <span>
                ${item.quantity}
              </span>


              <button
                type="button"
                data-cart-action="plus"
                data-index="${index}">

                +

              </button>


              <button
                type="button"
                data-cart-action="remove"
                data-index="${index}"
                aria-label="Remove item">

                ×

              </button>

            </div>

          </div>

        `;

      }
    )
    .join("");


  if (totalElement) {

    totalElement.textContent =
      `₹${total.toLocaleString("en-IN")}`;

  }


  $$("[data-cart-action]").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const index =
            Number(
              button.dataset.index
            );

          const action =
            button.dataset.cartAction;


          if (
            action === "plus"
          ) {

            cart[index].quantity += 1;

          }


          if (
            action === "minus"
          ) {

            cart[index].quantity -= 1;


            if (
              cart[index].quantity <= 0
            ) {

              cart.splice(
                index,
                1
              );

            }

          }


          if (
            action === "remove"
          ) {

            cart.splice(
              index,
              1
            );

          }


          saveCart();

          updateCartCount();

          renderCart();

        }
      );

    }
  );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

  createCartPanel();

  renderCart();

  $("#luckeyCartPanel")
    .classList.add("show");

  document.body.style.overflow =
    "hidden";

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

  const panel =
    $("#luckeyCartPanel");

  if (!panel) return;

  panel.classList.remove("show");

  document.body.style.overflow =
    "";

}


/* =========================================================
   CART BUTTON
   ========================================================= */

const cartButton =
  $("#cartBtn");


if (cartButton) {

  cartButton.addEventListener(
    "click",
    openCart
  );

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

  if (cart.length === 0) {

    showToast(
      "Cart is already empty"
    );

    return;
  }


  cart = [];

  saveCart();

  updateCartCount();

  renderCart();

  showToast(
    "Cart cleared"
  );

}


/* =========================================================
   WHATSAPP CHECKOUT
   ========================================================= */

function checkoutWhatsApp() {

  if (cart.length === 0) {

    showToast(
      "Your cart is empty"
    );

    return;

  }


  /*
    CHANGE THIS TO YOUR REAL
    WHATSAPP NUMBER.

    India example:
    919876543210
  */

  const whatsappNumber =
    "919999999999";


  let total = 0;


  const products =
    cart.map(
      (item) => {

        const numericPrice =
          Number(
            String(item.price)
              .replace(/[^\d.]/g, "")
          ) || 0;


        total +=
          numericPrice *
          item.quantity;


        return `• ${item.name} × ${item.quantity} — ${item.price}`;

      }
    )
    .join("\n");


  const message =

`🛍️ LUCKEY SHOES STORE
━━━━━━━━━━━━━━━━━━

I want to place an order.

${products}

━━━━━━━━━━━━━━━━━━
💰 Total: ₹${total.toLocaleString("en-IN")}

Please confirm my order.

Thank you! 👟`;


  const url =
    `https://wa.me/${whatsappNumber}?text=${
      encodeURIComponent(message)
    }`;


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* =========================================================
   PRODUCT FILTER
   ========================================================= */

const filters =
  $$(".filter");

const products =
  $$(".product-card");


filters.forEach(
  (filter) => {

    filter.addEventListener(
      "click",
      () => {

        filters.forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );


        filter.classList.add(
          "active"
        );


        const selected =
          filter.dataset.filter;


        products.forEach(
          (product) => {

            const category =
              product.dataset.category;


            if (
              selected === "all" ||
              category === selected
            ) {

              product.style.display =
                "";

            } else {

              product.style.display =
                "none";

            }

          }
        );

      }
    );

  }
);


/* =========================================================
   CONTACT FORM → WHATSAPP
   ========================================================= */

const contactForm =
  $("#contactForm");


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const name =
        $("#contactName")
          ?.value
          .trim() || "";


      const email =
        $("#contactEmail")
          ?.value
          .trim() || "";


      const phone =
        $("#contactPhone")
          ?.value
          .trim() || "";


      const subject =
        $("#contactSubject")
          ?.value
          .trim() || "";


      const message =
        $("#contactMessage")
          ?.value
          .trim() || "";


      if (!name) {

        showToast(
          "Please enter your name"
        );

        return;

      }


      if (!email) {

        showToast(
          "Please enter your email"
        );

        return;

      }


      if (!subject) {

        showToast(
          "Please enter a subject"
        );

        return;

      }


      if (!message) {

        showToast(
          "Please enter your message"
        );

        return;

      }


      /*
        CHANGE TO YOUR REAL
        WHATSAPP NUMBER.
      */

      const whatsappNumber =
        "919999999999";


      const whatsappMessage =

`🟤 LUCKEY SHOES STORE
━━━━━━━━━━━━━━━━━━

📩 NEW CUSTOMER MESSAGE

👤 Name:
${name}

📧 Email:
${email}

📱 Phone:
${phone || "Not provided"}

📌 Subject:
${subject}

💬 Message:
${message}

━━━━━━━━━━━━━━━━━━
Sent from Luckey Shoes Store website`;


      const url =
        `https://wa.me/${whatsappNumber}?text=${
          encodeURIComponent(
            whatsappMessage
          )
        }`;


      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );


      contactForm.reset();


      showToast(
        "Opening WhatsApp..."
      );

    }
  );

}


/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

$$('a[href^="#"]').forEach(
  (link) => {

    link.addEventListener(
      "click",
      (event) => {

        const id =
          link.getAttribute("href");


        if (
          id &&
          id !== "#"
        ) {

          const target =
            document.querySelector(id);


          if (target) {

            event.preventDefault();


            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }

      }
    );

  }
);


/* =========================================================
   KEYBOARD — ESC CLOSES CART
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      closeCart();

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

updateCartCount();


/* =========================================================
   PAGE READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCartCount();

  }
);


/* =========================================================
   PART 14 — SEARCH + FILTER + SORT
   ========================================================= */

const productSearch =
  document.querySelector("#productSearch");

const clearSearch =
  document.querySelector("#clearSearch");

const productSort =
  document.querySelector("#productSort");

const shopProductGrid =
  document.querySelector(".products-grid");


let activeCategory = "all";


/* =========================================================
   GET PRODUCT CARDS
   ========================================================= */

function getProductCards() {

  if (!shopProductGrid) {
    return [];
  }

  return Array.from(
    shopProductGrid.querySelectorAll(
      ".product-card"
    )
  );

}


/* =========================================================
   FILTER PRODUCTS
   ========================================================= */

function filterProducts() {

  const cards =
    getProductCards();

  const searchValue =
    productSearch
      ? productSearch.value
          .trim()
          .toLowerCase()
      : "";


  cards.forEach((card) => {

    const name =
      (
        card.dataset.name ||
        card
          .querySelector("h3")
          ?.textContent ||
        ""
      )
      .toLowerCase();


    const category =
      (
        card.dataset.category ||
        ""
      )
      .toLowerCase();


    const matchesSearch =
      !searchValue ||
      name.includes(searchValue);


    const matchesCategory =
      activeCategory === "all" ||
      category === activeCategory;


    if (
      matchesSearch &&
      matchesCategory
    ) {

      card.style.display = "";

    } else {

      card.style.display = "none";

    }

  });


  updateNoResults();

}


/* =========================================================
   NO RESULTS MESSAGE
   ========================================================= */

function updateNoResults() {

  if (!shopProductGrid) {
    return;
  }


  const visibleProducts =
    getProductCards()
      .filter(
        (card) =>
          card.style.display !== "none"
      );


  let message =
    document.querySelector(
      "#noProductsMessage"
    );


  if (
    visibleProducts.length === 0
  ) {

    if (!message) {

      message =
        document.createElement(
          "div"
        );

      message.id =
        "noProductsMessage";

      message.className =
        "no-products";

      message.innerHTML = `

        <div class="no-products-icon">
          👟
        </div>

        <h3>
          No shoes found
        </h3>

        <p>
          Try another search or category.
        </p>

      `;

      shopProductGrid.parentNode
        .appendChild(message);

    }

  } else {

    if (message) {
      message.remove();
    }

  }

}


/* =========================================================
   SEARCH INPUT
   ========================================================= */

if (productSearch) {

  productSearch.addEventListener(
    "input",
    filterProducts
  );

}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

if (clearSearch) {

  clearSearch.addEventListener(
    "click",
    () => {

      if (productSearch) {
        productSearch.value = "";
      }

      activeCategory = "all";


      document
        .querySelectorAll(
          ".shop-filters .filter"
        )
        .forEach((button) => {

          button.classList.remove(
            "active"
          );

        });


      document
        .querySelector(
          '.shop-filters .filter[data-filter="all"]'
        )
        ?.classList.add("active");


      filterProducts();

      productSearch?.focus();

    }
  );

}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    ".shop-filters .filter"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        activeCategory =
          button.dataset.filter ||
          "all";


        document
          .querySelectorAll(
            ".shop-filters .filter"
          )
          .forEach((item) => {

            item.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        filterProducts();

      }
    );

  });


/* =========================================================
   SORT PRODUCTS
   ========================================================= */

if (productSort) {

  productSort.addEventListener(
    "change",
    () => {

      if (!shopProductGrid) {
        return;
      }


      const cards =
        getProductCards();


      const sortType =
        productSort.value;


      cards.sort(
        (a, b) => {

          if (
            sortType === "low"
          ) {

            return (
              Number(
                a.dataset.price || 0
              ) -
              Number(
                b.dataset.price || 0
              )
            );

          }


          if (
            sortType === "high"
          ) {

            return (
              Number(
                b.dataset.price || 0
              ) -
              Number(
                a.dataset.price || 0
              )
            );

          }


          if (
            sortType === "name"
          ) {

            return (
              (
                a.dataset.name ||
                ""
              ).localeCompare(
                b.dataset.name ||
                ""
              )
            );

          }


          return 0;

        }
      );


      cards.forEach(
        (card) => {

          shopProductGrid
            .appendChild(card);

        }
      );


      filterProducts();

    }
  );

}


/* =========================================================
   INITIAL FILTER
   ========================================================= */

if (shopProductGrid) {

  filterProducts();

}

/* =========================================================
   PART 15 — WISHLIST + PRODUCT DETAILS
   ========================================================= */

let wishlist = [];

try {

  wishlist =
    JSON.parse(
      localStorage.getItem("luckeyWishlist")
    ) || [];

} catch (error) {

  wishlist = [];

}


/* =========================================================
   SAVE WISHLIST
   ========================================================= */

function saveWishlist() {

  localStorage.setItem(
    "luckeyWishlist",
    JSON.stringify(wishlist)
  );

}


/* =========================================================
   WISHLIST COUNT
   ========================================================= */

function updateWishlistCount() {

  const count =
    document.querySelector("#wishlistCount");

  if (!count) return;

  count.textContent =
    wishlist.length;

}


/* =========================================================
   CHECK WISHLIST
   ========================================================= */

function isInWishlist(name) {

  return wishlist.some(
    item => item.name === name
  );

}


/* =========================================================
   UPDATE WISHLIST BUTTONS
   ========================================================= */

function updateWishlistButtons() {

  document
    .querySelectorAll(".wishlist-btn")
    .forEach(button => {

      const name =
        button.dataset.name;

      if (isInWishlist(name)) {

        button.classList.add("active");

        button.textContent = "♥";

        button.setAttribute(
          "aria-label",
          "Remove from wishlist"
        );

      } else {

        button.classList.remove("active");

        button.textContent = "♡";

        button.setAttribute(
          "aria-label",
          "Add to wishlist"
        );

      }

    });

}


/* =========================================================
   WISHLIST BUTTON
   ========================================================= */

document
  .querySelectorAll(".wishlist-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const item = {

          name:
            button.dataset.name,

          price:
            button.dataset.price,

          image:
            button.dataset.image

        };


        const existing =
          wishlist.find(
            product =>
              product.name === item.name
          );


        if (existing) {

          wishlist =
            wishlist.filter(
              product =>
                product.name !== item.name
            );

          showToast(
            "Removed from wishlist"
          );

        } else {

          wishlist.push(item);

          showToast(
            "Added to wishlist ❤️"
          );

        }


        saveWishlist();

        updateWishlistCount();

        updateWishlistButtons();

      }
    );

  });


/* =========================================================
   PRODUCT DETAILS MODAL
   ========================================================= */

function createProductModal() {

  if (
    document.querySelector(
      "#productDetailsModal"
    )
  ) {
    return;
  }


  const modal =
    document.createElement("div");

  modal.id =
    "productDetailsModal";

  modal.innerHTML = `

    <div class="product-modal-overlay"></div>

    <div
      class="product-modal"
      role="dialog"
      aria-modal="true">

      <button
        class="product-modal-close"
        id="closeProductModal"
        type="button"
        aria-label="Close">

        ✕

      </button>


      <div class="product-modal-image">

        <img
          id="modalProductImage"
          src=""
          alt="Product">

      </div>


      <div class="product-modal-content">

        <span
          id="modalProductCategory"
          class="modal-category">
        </span>

        <h2 id="modalProductName">
        </h2>

        <div
          id="modalProductPrice"
          class="modal-price">
        </div>

        <p
          id="modalProductDescription">
        </p>


        <button
          id="modalAddCart"
          class="btn primary"
          type="button">

          Add to Cart

        </button>

      </div>

    </div>

  `;


  document.body.appendChild(modal);


  document
    .querySelector(
      "#closeProductModal"
    )
    .addEventListener(
      "click",
      closeProductModal
    );


  document
    .querySelector(
      ".product-modal-overlay"
    )
    .addEventListener(
      "click",
      closeProductModal
    );

}


/* =========================================================
   OPEN PRODUCT DETAILS
   ========================================================= */

function openProductDetails(data) {

  createProductModal();


  const modal =
    document.querySelector(
      "#productDetailsModal"
    );


  document
    .querySelector(
      "#modalProductImage"
    )
    .src = data.image;


  document
    .querySelector(
      "#modalProductImage"
    )
    .alt = data.name;


  document
    .querySelector(
      "#modalProductName"
    )
    .textContent =
      data.name;


  document
    .querySelector(
      "#modalProductCategory"
    )
    .textContent =
      data.category;


  document
    .querySelector(
      "#modalProductPrice"
    )
    .textContent =
      `₹${Number(data.price).toLocaleString("en-IN")}`;


  document
    .querySelector(
      "#modalProductDescription"
    )
    .textContent =
      data.description;


  const addButton =
    document.querySelector(
      "#modalAddCart"
    );


  addButton.onclick = () => {

    const existing =
      cart.find(
        item =>
          item.name === data.name
      );


    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({

        name:
          data.name,

        price:
          data.price,

        quantity:
          1

      });

    }


    saveCart();

    updateCartCount();

    showToast(
      `${data.name} added to cart`
    );

    closeProductModal();

  };


  modal.classList.add("show");

  document.body.style.overflow =
    "hidden";

}


/* =========================================================
   CLOSE PRODUCT DETAILS
   ========================================================= */

function closeProductModal() {

  const modal =
    document.querySelector(
      "#productDetailsModal"
    );

  if (!modal) return;

  modal.classList.remove("show");

  document.body.style.overflow =
    "";

}


/* =========================================================
   VIEW DETAILS BUTTONS
   ========================================================= */

document
  .querySelectorAll(".view-details")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openProductDetails({

          name:
            button.dataset.name,

          price:
            button.dataset.price,

          category:
            button.dataset.category,

          image:
            button.dataset.image,

          description:
            button.dataset.description

        });

      }
    );

  });


/* =========================================================
   WISHLIST HEADER
   ========================================================= */

const wishlistBtn =
  document.querySelector(
    "#wishlistBtn"
  );


if (wishlistBtn) {

  wishlistBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();

      if (wishlist.length === 0) {

        showToast(
          "Your wishlist is empty ❤️"
        );

        return;

      }


      showToast(
        `${wishlist.length} item(s) in wishlist ❤️`
      );

    }
  );

}


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeProductModal();

    }

  }
);


/* =========================================================
   INITIALIZE PART 15
   ========================================================= */

updateWishlistCount();

updateWishlistButtons();

/* =========================================================
   PART 16 — CHECKOUT SYSTEM
   ========================================================= */

function loadCheckout() {

  const checkoutItems =
    document.querySelector("#checkoutItems");

  if (!checkoutItems) {
    return;
  }


  let checkoutCart = [];

  try {

    checkoutCart =
      JSON.parse(
        localStorage.getItem("luckeyCart")
      ) || [];

  } catch (error) {

    checkoutCart = [];

  }


  checkoutItems.innerHTML = "";


  let subtotal = 0;


  if (checkoutCart.length === 0) {

    checkoutItems.innerHTML = `

      <div class="empty-checkout">

        🛒

        <p>
          Your cart is empty.
        </p>

        <a href="shop.html">
          Go to Shop
        </a>

      </div>

    `;

  }


  checkoutCart.forEach(item => {

    const quantity =
      Number(item.quantity) || 1;

    const price =
      Number(item.price) || 0;

    const itemTotal =
      price * quantity;

    subtotal += itemTotal;


    const div =
      document.createElement("div");

    div.className =
      "checkout-item";


    div.innerHTML = `

      <div class="checkout-item-info">

        <strong>
          ${item.name || "Shoe"}
        </strong>

        <small>
          Quantity: ${quantity}
        </small>

      </div>

      <div class="checkout-item-price">
        ₹${itemTotal.toLocaleString("en-IN")}
      </div>

    `;


    checkoutItems.appendChild(div);

  });


  const subtotalElement =
    document.querySelector(
      "#checkoutSubtotal"
    );


  const totalElement =
    document.querySelector(
      "#checkoutTotal"
    );


  if (subtotalElement) {

    subtotalElement.textContent =
      `₹${subtotal.toLocaleString("en-IN")}`;

  }


  if (totalElement) {

    totalElement.textContent =
      `₹${subtotal.toLocaleString("en-IN")}`;

  }


  setupCheckoutForm(
    checkoutCart,
    subtotal
  );

}


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function setupCheckoutForm(
  checkoutCart,
  subtotal
) {

  const form =
    document.querySelector(
      "#checkoutForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (
        checkoutCart.length === 0
      ) {

        alert(
          "Your cart is empty. Please add a product first."
        );

        return;

      }


      const name =
        document.querySelector(
          "#customerName"
        ).value.trim();


      const phone =
        document.querySelector(
          "#customerPhone"
        ).value.trim();


      const email =
        document.querySelector(
          "#customerEmail"
        ).value.trim();


      const address =
        document.querySelector(
          "#customerAddress"
        ).value.trim();


      const city =
        document.querySelector(
          "#customerCity"
        ).value.trim();


      const pin =
        document.querySelector(
          "#customerPin"
        ).value.trim();


      const payment =
        document.querySelector(
          'input[name="payment"]:checked'
        )?.value ||
        "Cash on Delivery";


      if (
        !/^[0-9]{10}$/.test(phone)
      ) {

        alert(
          "Please enter a valid 10-digit mobile number."
        );

        return;

      }


      if (
        !/^[0-9]{6}$/.test(pin)
      ) {

        alert(
          "Please enter a valid 6-digit PIN code."
        );

        return;

      }


      let orderText =
        "🛍️ *NEW ORDER - LUCKEY SHOES STORE*%0A%0A";


      orderText +=
        `👤 *Name:* ${name}%0A`;

      orderText +=
        `📱 *Phone:* ${phone}%0A`;

      orderText +=
        `📧 *Email:* ${email || "Not provided"}%0A`;

      orderText +=
        `📍 *Address:* ${address}, ${city} - ${pin}%0A`;

      orderText +=
        `💳 *Payment:* ${payment}%0A%0A`;


      orderText +=
        "👟 *ORDER ITEMS:*%0A";


      checkoutCart.forEach(
        (item, index) => {

          const quantity =
            Number(item.quantity) || 1;

          const price =
            Number(item.price) || 0;

          const total =
            price * quantity;


          orderText +=
            `${index + 1}. ${item.name} × ${quantity} — ₹${total.toLocaleString("en-IN")}%0A`;

        }
      );


      orderText +=
        `%0A💰 *TOTAL: ₹${subtotal.toLocaleString("en-IN")}*%0A%0A`;

      orderText +=
        "Thank you for shopping with Luckey Shoes Store!";


      /*
        IMPORTANT:
        Replace this number with your
        Luckey Shoes Store WhatsApp number.

        Country code for India = 91
      */

      const whatsappNumber =
        "91XXXXXXXXXX";


      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${orderText}`;


      window.open(
        whatsappURL,
        "_blank"
      );

    }
  );

}


/* =========================================================
   START CHECKOUT
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  loadCheckout
);


/* =========================================================
   PART 17 — ADVANCED PRODUCT SEARCH & FILTERS
   ========================================================= */

(function () {

  const searchInput =
    document.querySelector("#productSearch");

  const categoryFilter =
    document.querySelector("#categoryFilter");

  const priceFilter =
    document.querySelector("#priceFilter");

  const sortProducts =
    document.querySelector("#sortProducts");

  const clearFilters =
    document.querySelector("#clearFilters");

  const resultCount =
    document.querySelector("#productResultCount");


  /*
   * Stop if this is not shop.html
   */

  if (
    !searchInput ||
    !categoryFilter ||
    !priceFilter ||
    !sortProducts
  ) {

    return;

  }


  function getProducts() {

    return [
      ...document.querySelectorAll(
        ".product-card"
      )
    ];

  }


  function checkPrice(
    price,
    filter
  ) {

    if (filter === "all") {
      return true;
    }


    if (filter === "0-2000") {

      return price < 2000;

    }


    if (filter === "2000-5000") {

      return price >= 2000 &&
             price <= 5000;

    }


    if (filter === "5000-10000") {

      return price > 5000 &&
             price <= 10000;

    }


    if (filter === "10000+") {

      return price > 10000;

    }


    return true;

  }


  function filterProducts() {

    const products =
      getProducts();


    const search =
      searchInput.value
        .trim()
        .toLowerCase();


    const category =
      categoryFilter.value
        .toLowerCase();


    const price =
      priceFilter.value;


    let visibleProducts = [];


    products.forEach(product => {

      const name =
        (
          product.dataset.name ||
          product.querySelector("h3")?.textContent ||
          ""
        )
        .toLowerCase();


      const productCategory =
        (
          product.dataset.category ||
          "all"
        )
        .toLowerCase();


      const productPrice =
        Number(
          product.dataset.price ||
          0
        );


      const matchesSearch =
        name.includes(search);


      const matchesCategory =
        category === "all" ||
        productCategory === category;


      const matchesPrice =
        checkPrice(
          productPrice,
          price
        );


      const visible =
        matchesSearch &&
        matchesCategory &&
        matchesPrice;


      if (visible) {

        product.classList.remove(
          "filter-hidden"
        );

        visibleProducts.push(product);

      } else {

        product.classList.add(
          "filter-hidden"
        );

      }

    });


    sortVisibleProducts(
      visibleProducts
    );


    updateResultCount(
      visibleProducts.length
    );


    showNoResults(
      visibleProducts.length
    );

  }


  function sortVisibleProducts(
    products
  ) {

    const sort =
      sortProducts.value;


    if (
      sort === "default"
    ) {

      return;

    }


    const container =
      products[0]?.parentElement;


    if (!container) {
      return;
    }


    products.sort(
      (a, b) => {

        const nameA =
          (
            a.dataset.name ||
            ""
          ).toLowerCase();


        const nameB =
          (
            b.dataset.name ||
            ""
          ).toLowerCase();


        const priceA =
          Number(
            a.dataset.price || 0
          );


        const priceB =
          Number(
            b.dataset.price || 0
          );


        if (sort === "low") {

          return priceA - priceB;

        }


        if (sort === "high") {

          return priceB - priceA;

        }


        if (sort === "az") {

          return nameA.localeCompare(
            nameB
          );

        }


        if (sort === "za") {

          return nameB.localeCompare(
            nameA
          );

        }


        return 0;

      }
    );


    products.forEach(
      product => {

        container.appendChild(
          product
        );

      }
    );

  }


  function updateResultCount(
    count
  ) {

    if (!resultCount) {
      return;
    }


    resultCount.textContent =
      `${count} ${
        count === 1
          ? "product"
          : "products"
      }`;

  }


  function showNoResults(
    count
  ) {

    const existing =
      document.querySelector(
        ".no-filter-results"
      );


    if (count > 0) {

      if (existing) {

        existing.remove();

      }

      return;

    }


    if (existing) {
      return;
    }


    const grid =
      document.querySelector(
        ".products-grid"
      );


    if (!grid) {
      return;
    }


    const message =
      document.createElement(
        "div"
      );


    message.className =
      "no-filter-results";


    message.innerHTML = `

      <div class="no-result-icon">
        👟
      </div>

      <h3>
        No shoes found
      </h3>

      <p>
        Try another search or change your filters.
      </p>

    `;


    grid.parentNode.insertBefore(
      message,
      grid
    );

  }


  function resetFilters() {

    searchInput.value = "";

    categoryFilter.value =
      "all";

    priceFilter.value =
      "all";

    sortProducts.value =
      "default";


    filterProducts();

  }


  searchInput.addEventListener(
    "input",
    filterProducts
  );


  categoryFilter.addEventListener(
    "change",
    filterProducts
  );


  priceFilter.addEventListener(
    "change",
    filterProducts
  );


  sortProducts.addEventListener(
    "change",
    filterProducts
  );


  if (clearFilters) {

    clearFilters.addEventListener(
      "click",
      resetFilters
    );

  }


  /*
   * Initial filter
   */

  filterProducts();

})();


/* =========================================================
   PART 18 — CUSTOMER REVIEWS & RATINGS
   ========================================================= */

(function () {

  const reviewForm =
    document.querySelector("#reviewForm");

  const reviewsList =
    document.querySelector("#reviewsList");

  const starSelector =
    document.querySelector("#starSelector");


  /*
   * Only run on pages containing
   * the review system.
   */

  if (
    !reviewForm ||
    !reviewsList ||
    !starSelector
  ) {

    return;

  }


  let selectedRating = 5;


  let reviews = [];


  try {

    reviews =
      JSON.parse(
        localStorage.getItem(
          "luckeyReviews"
        )
      ) || [];

  } catch (error) {

    reviews = [];

  }


  /* =======================================================
     STAR SELECTOR
     ======================================================= */

  const starButtons =
    starSelector.querySelectorAll(
      "button"
    );


  function updateStarSelector() {

    starButtons.forEach(
      button => {

        const rating =
          Number(
            button.dataset.rating
          );


        button.classList.toggle(
          "active",
          rating <= selectedRating
        );

      }
    );

  }


  starButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          selectedRating =
            Number(
              button.dataset.rating
            );

          updateStarSelector();

        }
      );

    }
  );


  /* =======================================================
     SAVE REVIEWS
     ======================================================= */

  function saveReviews() {

    localStorage.setItem(
      "luckeyReviews",
      JSON.stringify(reviews)
    );

  }


  /* =======================================================
     STAR STRING
     ======================================================= */

  function getStars(rating) {

    return (
      "★".repeat(rating) +
      "☆".repeat(5 - rating)
    );

  }


  /* =======================================================
     DISPLAY REVIEWS
     ======================================================= */

  function displayReviews() {

    reviewsList.innerHTML = "";


    if (reviews.length === 0) {

      reviewsList.innerHTML = `

        <div class="empty-reviews">

          ⭐

          <h3>
            No reviews yet
          </h3>

          <p>
            Be the first customer to review
            Luckey Shoes Store.
          </p>

        </div>

      `;

      updateRatingSummary();

      return;

    }


    /*
     * Newest reviews first
     */

    const reversed =
      [...reviews].reverse();


    reversed.forEach(
      review => {

        const card =
          document.createElement(
            "article"
          );


        card.className =
          "review-card";


        const initial =
          (
            review.name ||
            "C"
          )
          .charAt(0)
          .toUpperCase();


        card.innerHTML = `

          <div class="review-top">

            <div class="review-user">

              <div class="review-avatar">
                ${initial}
              </div>

              <div>

                <strong>
                  ${escapeHTML(
                    review.name
                  )}
                </strong>

                <div class="review-date">
                  ${escapeHTML(
                    review.date
                  )}
                </div>

              </div>

            </div>

            <div class="review-stars">
              ${getStars(
                review.rating
              )}
            </div>

          </div>


          <p>
            ${escapeHTML(
              review.text
            )}
          </p>


          <button
            type="button"
            class="delete-review"
            data-id="${review.id}">

            Delete

          </button>

        `;


        reviewsList.appendChild(
          card
        );

      }
    );


    /*
     * Delete review
     */

    reviewsList
      .querySelectorAll(
        ".delete-review"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.id;


            reviews =
              reviews.filter(
                review =>
                  String(review.id) !==
                  String(id)
              );


            saveReviews();

            displayReviews();

          }
        );

      });


    updateRatingSummary();

  }


  /* =======================================================
     RATING SUMMARY
     ======================================================= */

  function updateRatingSummary() {

    const averageElement =
      document.querySelector(
        "#averageRating"
      );


    const starsElement =
      document.querySelector(
        "#averageStars"
      );


    const countElement =
      document.querySelector(
        "#reviewCount"
      );


    if (!averageElement) {
      return;
    }


    if (reviews.length === 0) {

      averageElement.textContent =
        "0.0";

      starsElement.textContent =
        "☆☆☆☆☆";

      countElement.textContent =
        "0";

      return;

    }


    const total =
      reviews.reduce(
        (sum, review) =>
          sum + Number(
            review.rating
          ),
        0
      );


    const average =
      total / reviews.length;


    const rounded =
      Math.round(
        average
      );


    averageElement.textContent =
      average.toFixed(1);


    starsElement.textContent =
      getStars(rounded);


    countElement.textContent =
      reviews.length;

  }


  /* =======================================================
     SUBMIT REVIEW
     ======================================================= */

  reviewForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        document.querySelector(
          "#reviewName"
        ).value.trim();


      const text =
        document.querySelector(
          "#reviewText"
        ).value.trim();


      if (!name || !text) {

        alert(
          "Please complete your name and review."
        );

        return;

      }


      if (
        text.length < 5
      ) {

        alert(
          "Please write a little more about your experience."
        );

        return;

      }


      const newReview = {

        id:
          Date.now(),

        name:
          name,

        rating:
          selectedRating,

        text:
          text,

        date:
          new Date().toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric"
            }
          )

      };


      reviews.push(
        newReview
      );


      saveReviews();

      reviewForm.reset();


      selectedRating = 5;

      updateStarSelector();

      displayReviews();


      /*
       * Scroll to reviews
       */

      reviewsList.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );


  /* =======================================================
     BASIC HTML ESCAPING
     ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  updateStarSelector();

  displayReviews();

})();


<script>
/* =====================================================
   PART 20 — CART SYSTEM
===================================================== */

function getLuckeyCart() {
  return JSON.parse(
    localStorage.getItem("luckeyCart")
  ) || [];
}


function saveLuckeyCart(cart) {
  localStorage.setItem(
    "luckeyCart",
    JSON.stringify(cart)
  );
}


/* OPEN CART */

function openCart() {

  renderCart();

  document
    .getElementById("cartDrawer")
    .classList.add("active");

  document
    .getElementById("cartOverlay")
    .classList.add("active");

  document.body.style.overflow = "hidden";
}


/* CLOSE CART */

function closeCart() {

  document
    .getElementById("cartDrawer")
    .classList.remove("active");

  document
    .getElementById("cartOverlay")
    .classList.remove("active");

  document.body.style.overflow = "";
}


/* RENDER CART */

function renderCart() {

  const cart = getLuckeyCart();

  const container =
    document.getElementById("cartItems");

  const empty =
    document.getElementById("emptyCart");

  const footer =
    document.getElementById("cartFooter");

  container.innerHTML = "";

  if (cart.length === 0) {

    empty.classList.add("active");
    footer.style.display = "none";

    updateCartCount();

    return;
  }

  empty.classList.remove("active");
  footer.style.display = "block";


  cart.forEach((item, index) => {

    const price =
      parsePrice(item.price);

    const quantity =
      Number(item.quantity) || 1;

    const itemTotal =
      price * quantity;

    const div =
      document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `

      <div class="cart-item-image">
        <img
          src="${item.image}"
          alt="${escapeHtml(item.name)}"
        >
      </div>

      <div class="cart-item-info">

        <h4>
          ${escapeHtml(item.name)}
        </h4>

        <p>
          Size: ${item.size || "8"}
        </p>

        <div class="cart-item-price">
          ₹${itemTotal.toLocaleString("en-IN")}
        </div>

        <div class="quantity-controls">

          <button
            onclick="changeCartQuantity(${index}, -1)"
          >
            −
          </button>

          <span>
            ${quantity}
          </span>

          <button
            onclick="changeCartQuantity(${index}, 1)"
          >
            +
          </button>

        </div>

      </div>

      <button
        class="remove-cart-item"
        onclick="removeCartItem(${index})"
        aria-label="Remove product"
      >
        🗑
      </button>

    `;

    container.appendChild(div);

  });


  updateCartTotals(cart);
  updateCartCount();
}


/* CHANGE QUANTITY */

function changeCartQuantity(index, amount) {

  const cart = getLuckeyCart();

  if (!cart[index]) return;

  cart[index].quantity =
    (Number(cart[index].quantity) || 1) + amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveLuckeyCart(cart);

  renderCart();
}


/* REMOVE ITEM */

function removeCartItem(index) {

  const cart = getLuckeyCart();

  cart.splice(index, 1);

  saveLuckeyCart(cart);

  renderCart();
}


/* PRICE */

function parsePrice(price) {

  if (typeof price === "number") {
    return price;
  }

  return Number(
    String(price)
      .replace(/[₹,\s]/g, "")
      .replace(/[^\d.]/g, "")
  ) || 0;
}


/* TOTAL */

function updateCartTotals(cart) {

  let subtotal = 0;

  cart.forEach(item => {

    subtotal +=
      parsePrice(item.price) *
      (Number(item.quantity) || 1);

  });

  document.getElementById("cartSubtotal")
    .textContent =
    "₹" + subtotal.toLocaleString("en-IN");

  document.getElementById("cartTotal")
    .textContent =
    "₹" + subtotal.toLocaleString("en-IN");

  document.getElementById("checkoutTotal")
    .textContent =
    "₹" + subtotal.toLocaleString("en-IN");
}


/* CART COUNT */

function updateCartCount() {

  const cart = getLuckeyCart();

  const count = cart.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 1),
    0
  );

  document.querySelectorAll(
    ".cart-count, #cartCount"
  ).forEach(element => {

    element.textContent = count;

    element.style.display =
      count > 0 ? "inline-flex" : "none";

  });
}


/* CHECKOUT */

function openCheckout() {

  const cart = getLuckeyCart();

  if (cart.length === 0) {

    alert("Your cart is empty.");

    return;
  }

  updateCartTotals(cart);

  document
    .getElementById("checkoutOverlay")
    .classList.add("active");

}


function closeCheckout() {

  document
    .getElementById("checkoutOverlay")
    .classList.remove("active");

}


/* PLACE ORDER */

function placeOrder(event) {

  event.preventDefault();

  const cart = getLuckeyCart();

  if (cart.length === 0) {

    alert("Your cart is empty.");

    return;
  }


  const name =
    document.getElementById("customerName").value.trim();

  const phone =
    document.getElementById("customerPhone").value.trim();

  const email =
    document.getElementById("customerEmail").value.trim();

  const address =
    document.getElementById("customerAddress").value.trim();

  const payment =
    document.getElementById("paymentMethod").value;


  if (!name || !phone || !email || !address || !payment) {

    alert("Please complete all checkout fields.");

    return;
  }


  const orderId =
    "LS" +
    Date.now().toString().slice(-8);


  localStorage.setItem(
    "luckeyLastOrder",
    JSON.stringify({

      orderId,
      name,
      phone,
      email,
      address,
      payment,
      products: cart,
      date: new Date().toISOString()

    })
  );


  localStorage.removeItem("luckeyCart");


  document
    .getElementById("orderId")
    .textContent = orderId;


  document
    .getElementById("checkoutOverlay")
    .classList.remove("active");


  document
    .getElementById("cartDrawer")
    .classList.remove("active");


  document
    .getElementById("cartOverlay")
    .classList.remove("active");


  document
    .getElementById("orderSuccess")
    .classList.add("active");


  document.getElementById("checkoutForm").reset();

  updateCartCount();

  document.body.style.overflow = "hidden";
}


/* SUCCESS CLOSE */

function closeSuccess() {

  document
    .getElementById("orderSuccess")
    .classList.remove("active");

  document.body.style.overflow = "";
}


/* BASIC HTML ESCAPE */

function escapeHtml(text) {

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* INITIALIZE */

document.addEventListener(
  "DOMContentLoaded",
  function() {
    updateCartCount();
  }
);


/* ESCAPE KEY */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeCart();
      closeCheckout();
      closeSuccess();

    }

  }
);
</script>


<script>
/* =====================================================
   PART 21 — ORDER TRACKING JS
===================================================== */

function getLastLuckeyOrder() {

  return JSON.parse(
    localStorage.getItem("luckeyLastOrder")
  );

}


/* =====================================================
   TRACK ORDER
===================================================== */

function trackLuckeyOrder() {

  const input =
    document
      .getElementById("trackingOrderInput")
      .value
      .trim()
      .toUpperCase();

  const result =
    document.getElementById("trackingResult");

  const order =
    getLastLuckeyOrder();


  if (!input) {

    result.innerHTML = `
      <div class="tracking-card">
        <strong>Please enter your order ID.</strong>
      </div>
    `;

    return;
  }


  if (!order || order.orderId !== input) {

    result.innerHTML = `
      <div class="tracking-card">

        <h3>Order Not Found</h3>

        <p>
          We could not find an order with ID
          <strong>${escapeHtml(input)}</strong>.
        </p>

        <small>
          Make sure you entered the correct order ID.
        </small>

      </div>
    `;

    return;
  }


  renderTrackingOrder(order);
}


/* =====================================================
   SHOW ORDER
===================================================== */

function renderTrackingOrder(order) {

  const result =
    document.getElementById("trackingResult");


  let productsHTML = "";

  order.products.forEach(item => {

    const quantity =
      Number(item.quantity) || 1;

    const price =
      parsePrice(item.price) * quantity;


    productsHTML += `

      <div class="tracking-product">

        <img
          src="${item.image}"
          alt="${escapeHtml(item.name)}"
        >

        <div class="tracking-product-info">

          <strong>
            ${escapeHtml(item.name)}
          </strong>

          <span>
            Size: ${escapeHtml(item.size || "8")}
            · Qty: ${quantity}
          </span>

        </div>

        <div class="tracking-product-price">
          ₹${price.toLocaleString("en-IN")}
        </div>

      </div>

    `;

  });


  const total =
    order.products.reduce(
      (sum, item) =>
        sum +
        parsePrice(item.price) *
        (Number(item.quantity) || 1),
      0
    );


  result.innerHTML = `

    <div class="tracking-card">

      <div class="tracking-card-header">

        <div>

          <p>ORDER ID</p>

          <h3>
            ${escapeHtml(order.orderId)}
          </h3>

        </div>

        <div class="tracking-status">
          Confirmed
        </div>

      </div>


      <div class="tracking-steps">

        <div class="tracking-step active">

          <div class="tracking-step-icon">
            ✓
          </div>

          <strong>Ordered</strong>

          <small>Confirmed</small>

        </div>


        <div class="tracking-step active">

          <div class="tracking-step-icon">
            ✓
          </div>

          <strong>Processing</strong>

          <small>Preparing</small>

        </div>


        <div class="tracking-step">

          <div class="tracking-step-icon">
            3
          </div>

          <strong>Shipped</strong>

          <small>Pending</small>

        </div>


        <div class="tracking-step">

          <div class="tracking-step-icon">
            4
          </div>

          <strong>Delivered</strong>

          <small>Pending</small>

        </div>

      </div>


      <div class="tracking-products">

        <h3>Order Items</h3>

        ${productsHTML}

      </div>


      <div class="tracking-actions">

        <button
          class="whatsapp-order-btn"
          onclick="sendOrderToWhatsApp()"
        >
          WhatsApp Order
        </button>

        <button
          class="history-button"
          onclick="openOrderHistory()"
        >
          Order History
        </button>

      </div>

    </div>

  `;

}


/* =====================================================
   WHATSAPP
===================================================== */

function sendOrderToWhatsApp() {

  const order =
    getLastLuckeyOrder();

  if (!order) {

    alert("No order found.");

    return;
  }


  let message =
    "LUCKEY SHOES ORDER%0A%0A";

  message +=
    "Order ID: " +
    order.orderId +
    "%0A";

  message +=
    "Customer: " +
    order.name +
    "%0A";

  message +=
    "Phone: " +
    order.phone +
    "%0A";

  message +=
    "Payment: " +
    order.payment +
    "%0A%0A";

  message +=
    "Products:%0A";


  order.products.forEach(item => {

    message +=
      "- " +
      item.name +
      " | Size: " +
      (item.size || "8") +
      " | Qty: " +
      (item.quantity || 1) +
      "%0A";

  });


  /*
    IMPORTANT:
    Replace 919999999999 with
    YOUR BUSINESS WHATSAPP NUMBER.
  */

  const businessNumber =
    "919999999999";


  const url =
    "https://wa.me/" +
    businessNumber +
    "?text=" +
    message;


  window.open(url, "_blank");

}


/* =====================================================
   ORDER HISTORY
===================================================== */

function openOrderHistory() {

  const history =
    document.getElementById(
      "orderHistoryList"
    );

  const order =
    getLastLuckeyOrder();


  if (!order) {

    history.innerHTML = `
      <div class="history-empty">
        <div style="font-size:45px;">📦</div>

        <h3>No Orders Yet</h3>

        <p>
          Your completed orders will appear here.
        </p>
      </div>
    `;

  } else {

    const total =
      order.products.reduce(
        (sum, item) =>
          sum +
          parsePrice(item.price) *
          (Number(item.quantity) || 1),
        0
      );


    history.innerHTML = `

      <div class="history-item">

        <div class="history-item-top">

          <strong>
            ${escapeHtml(order.orderId)}
          </strong>

          <strong>
            ₹${total.toLocaleString("en-IN")}
          </strong>

        </div>

        <small>
          Customer:
          ${escapeHtml(order.name)}
        </small>

        <small>
          Payment:
          ${escapeHtml(order.payment)}
        </small>

        <small>
          Status:
          Confirmed
        </small>

      </div>

    `;

  }


  document
    .getElementById("historyOverlay")
    .classList.add("active");

}


function closeOrderHistory() {

  document
    .getElementById("historyOverlay")
    .classList.remove("active");

}


/* =====================================================
   CLOSE MODAL OUTSIDE CLICK
===================================================== */

document
  .getElementById("historyOverlay")
  .addEventListener(
    "click",
    function(event) {

      if (event.target === this) {
        closeOrderHistory();
      }

    }
  );

</script>