(() => {
    const number = "923271576380";
    function addWhatsAppButton() {
        if (document.querySelector(".whatsapp-float")) return;
        const link = document.createElement("a");
        link.className = "whatsapp-float";
        link.href = `https://wa.me/${number}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "Chat with The Stationery Spot on WhatsApp");
        link.innerHTML = "💬 <span>Chat with us</span>";
        document.body.appendChild(link);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addWhatsAppButton); else addWhatsAppButton();
})();
