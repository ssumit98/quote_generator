document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const pricingTableBody = document.getElementById('pricing-table-body');
    const subtotalPriceElement = document.getElementById('subtotal-price');
    const discountInput = document.getElementById('discount-amount');
    const totalPriceElement = document.getElementById('total-price');
    const generatePdfButton = document.getElementById('generate-pdf-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const modal = document.getElementById('item-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalItemsList = document.getElementById('modal-items-list');
    const otherItemNameInput = document.getElementById('other-item-name');
    const otherItemPriceInput = document.getElementById('other-item-price');
    const addCustomItemButton = document.getElementById('add-custom-item-btn');
    const closeModalButton = document.getElementById('close-modal-btn');

    // --- Data Structure ---
    const predefinedCategories = {
        "Static/landing page": [
             { name: "Core Pages (Home, About, Contact) - Design & Dev", price: 18000 },
             { name: "Single Landing Page (Optimized)", price: 15000 },
             { name: "Additional Static Page", price: 5000 }
        ],
        "API": [
             { name: "Simple CRUD Endpoints (per resource)", price: 2500 },
             { name: "API w/ Validation & Error Handling", price: 4000 },
             { name: "Complex API (Auth, Ext. Integration)", price: 15000 }
        ],
        "Database": [
             { name: "DB Schema Design & Setup", price: 9000 },
             { name: "Complex Queries/Relations Optimization", price: 17000 },
             { name: "Basic DB Integration (Connection, Simple CRUD)", price: 6000 }
        ],
        "Functions": [
             { name: "Basic UI Interactivity (JS)", price: 500 },
             { name: "Form Processing (Client/Server Validation)", price: 2500 },
             { name: "State Management Setup (e.g., Context, Redux basic)", price: 6000 },
             { name: "Realtime Feature (WebSocket Setup)", price: 15000 }
        ],
         "Deployment & Hosting": [
             { name: "Static Deployment (Netlify/Vercel/etc.)", price: 1500 },
             { name: "Server/App Deployment (Cloud)", price: 8000 },
             { name: "Domain & SSL Configuration", price: 1000 }
        ],
        "Maintenance & Support": [
             { name: "Monthly Retainer (Std Updates, Backup)", price: 4000 },
             { name: "Hourly Rate (Ad-hoc Support/Changes)", price: 1200 },
             { name: "Project Documentation Package", price: 4000 }
        ]
    };

    // --- Pricing Table Logic ---
    function addItemToTable(name, price) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'editable-item-name neumorphic-inset-weak';
        nameInput.value = name;
        nameCell.appendChild(nameInput);

        const priceCell = document.createElement('td');
        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.className = 'item-price-input neumorphic-inset';
        priceInput.value = parseFloat(price).toFixed(2);
        priceInput.min = '0';
        priceInput.step = '0.01';
        priceInput.addEventListener('input', updateTotalPrice);
        priceCell.appendChild(priceInput);

        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'neumorphic-button remove-item-btn';
        removeButton.addEventListener('click', () => {
            row.remove();
            updateTotalPrice();
        });
        actionCell.appendChild(removeButton);

        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(actionCell);
        pricingTableBody.appendChild(row);
        updateTotalPrice();
    }

    function updateTotalPrice() {
        let subtotal = 0;
        const priceInputs = pricingTableBody.querySelectorAll('.item-price-input');
        priceInputs.forEach(input => {
            subtotal += parseFloat(input.value) || 0;
        });
        const discount = parseFloat(discountInput.value) || 0;
        const finalTotal = Math.max(0, subtotal - discount);
        subtotalPriceElement.textContent = `Rs. ${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        totalPriceElement.textContent = `Rs. ${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    discountInput.addEventListener('input', updateTotalPrice);

    // --- Modal Logic ---
    function openModal(categoryName) {
        const items = predefinedCategories[categoryName];
        if (!items) return;
        modalTitle.textContent = `Add ${categoryName} Items`;
        modalItemsList.innerHTML = '';
        items.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'modal-item';
            const label = document.createElement('span');
            label.textContent = item.name;
            const priceDisplay = document.createElement('span');
            priceDisplay.className = 'item-price-display';
            priceDisplay.textContent = `Rs. ${item.price.toLocaleString('en-IN')}`;
            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.className = 'neumorphic-button modal-add-item-btn';
            addButton.dataset.itemName = item.name;
            addButton.dataset.itemPrice = item.price;
            addButton.addEventListener('click', () => {
                addItemToTable(item.name, item.price);
                addButton.style.backgroundColor = '#a5d6a7';
                setTimeout(() => { addButton.style.backgroundColor = '#c8e6c9'; }, 200);
            });
            itemDiv.appendChild(label);
            itemDiv.appendChild(priceDisplay);
            itemDiv.appendChild(addButton);
            modalItemsList.appendChild(itemDiv);
        });
        otherItemNameInput.value = '';
        otherItemPriceInput.value = '';
        modal.classList.add('active');
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            openModal(category);
        });
    });

    addCustomItemButton.addEventListener('click', () => {
        const otherName = otherItemNameInput.value.trim();
        const otherPrice = parseFloat(otherItemPriceInput.value);
        if (otherName && !isNaN(otherPrice) && otherPrice >= 0) {
            addItemToTable(otherName, otherPrice);
            otherItemNameInput.value = '';
            otherItemPriceInput.value = '';
        } else if (otherName && (isNaN(otherPrice) || otherPrice < 0)) {
            alert("Please enter a valid price for the custom item.");
        } else if (!otherName && !isNaN(otherPrice) && otherPrice >= 0) {
             alert("Please enter a name for the custom item.");
        }
    });

    closeModalButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // --- PDF Generation Logic ---
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-IN', { dateStyle: 'long' });

    generatePdfButton.addEventListener('click', () => {
        // Ensure jsPDF and autoTable are loaded
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
             console.error('Error: jsPDF library not loaded correctly.');
             alert('Error: Could not load PDF generation library (jsPDF).');
             return;
         }
         if (typeof window.jspdf.plugin === 'undefined' || typeof window.jspdf.plugin.autotable === 'undefined') {
              console.error('Error: jsPDF-AutoTable plugin not loaded correctly.');
              // Alert is optional, basic tables might still work if fallback exists
              // alert('Error: Could not load PDF table generation library (AutoTable). Tables might look basic.');
          }

        const { jsPDF } = window.jspdf; // Destructure jsPDF constructor
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });

        // --- Gather Data ---
        const companyName = document.getElementById('company-name').textContent;
        const contactInfo = document.getElementById('contact-info').textContent;
        const termsConditions = document.getElementById('terms-conditions').textContent;
        const ownershipIp = document.getElementById('ownership-ip').textContent;
        const quoteDate = document.getElementById('current-date').textContent;
        const customerName = document.getElementById('customer-name').value || 'N/A';
        const projectOverview = document.getElementById('project-overview').value || 'N/A';

        const pricingItems = [];
        let calculatedSubtotal = 0;
        const pricingRows = pricingTableBody.querySelectorAll('tr');
        pricingRows.forEach(row => {
            const nameInput = row.querySelector('input[type="text"]');
            const priceInput = row.querySelector('input[type="number"]');
            if (nameInput && priceInput) {
                const name = nameInput.value;
                const price = parseFloat(priceInput.value);
                if (name && !isNaN(price) && price >= 0) {
                    pricingItems.push({ name, price: price.toFixed(2) });
                    calculatedSubtotal += price;
                }
            }
        });
        const discountValue = parseFloat(discountInput.value) || 0;
        const finalTotalValue = Math.max(0, calculatedSubtotal - discountValue);
        const formattedSubtotal = `Rs. ${calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formattedDiscount = `Rs. ${discountValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formattedTotal = `Rs. ${finalTotalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const timeline = [
            { phase: "Discovery & Design", start: document.getElementById('phase1-start').value, end: document.getElementById('phase1-end').value },
            { phase: "Development & Integration", start: document.getElementById('phase2-start').value, end: document.getElementById('phase2-end').value },
            { phase: "Testing & QA", start: document.getElementById('phase3-start').value, end: document.getElementById('phase3-end').value },
            { phase: "Deployment & Handover", start: document.getElementById('phase4-start').value, end: document.getElementById('phase4-end').value },
        ];
        const paymentAdvance = document.getElementById('payment-advance').value || 'N/A';
        const paymentCompletion = document.getElementById('payment-completion').value || 'N/A';
        const paymentDelivery = document.getElementById('payment-delivery').value || 'N/A';

        // --- PDF Styling Constants (Defined within the listener scope) ---
        const primaryColor = [45, 52, 54];
        const secondaryColor = [99, 110, 114];
        const accentColor = [0, 184, 148];
        const backgroundColor = [255, 255, 255];
        const headerBgColor = [248, 249, 250];
        const tableHeaderBg = [63, 81, 181];
        const tableHeaderColor = [255, 255, 255];
        const leftMargin = 15;
        // ******** FIX: Define rightMarginCoord HERE ********
        const rightMarginCoord = 210 - leftMargin; // Coordinate of the right margin edge (195)
        // ************************************************
        const contentWidth = rightMarginCoord - leftMargin; // Width available for content (180)
        let yPos = 0;

        // --- PDF Drawing Functions (Defined within the listener scope, can access constants) ---
        function addHeader() {
            doc.setFillColor(...headerBgColor);
            doc.rect(0, 0, 210, 25, 'F');
            yPos = 10;
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...primaryColor);
            doc.text(companyName, leftMargin, yPos);

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...secondaryColor);
            // Use rightMarginCoord for alignment
            doc.text(contactInfo.split('|')[0]?.trim() ?? '', rightMarginCoord, yPos - 2, { align: 'right' });
            doc.text(contactInfo.split('|')[1]?.trim() ?? '', rightMarginCoord, yPos + 2, { align: 'right' });
            doc.text(contactInfo.split('|')[2]?.trim() ?? '', rightMarginCoord, yPos + 6, { align: 'right' });
            yPos = 30;
        }

        function addSectionTitle(title) {
            checkPageBreak(14); // Space needed for title + spacing
            yPos += 6;
            doc.setFontSize(13);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...primaryColor);
            doc.text(title, leftMargin, yPos);
            doc.setLineWidth(0.4);
            doc.setDrawColor(...accentColor);
            doc.line(leftMargin, yPos + 1.5, leftMargin + 40, yPos + 1.5);
            yPos += 8;
        }

        function addBodyText(text, options = {}) {
             const fontSize = options.fontSize || 9.5;
             const spacing = options.spacing || 3;
             const lineHeight = fontSize * 0.35 * 1.3; // Estimate line height factor

             doc.setFontSize(fontSize);
             doc.setFont(undefined, 'normal');
             doc.setTextColor(...secondaryColor);
             const splitText = doc.splitTextToSize(text, options.maxWidth || contentWidth);

             checkPageBreak(splitText.length * lineHeight + spacing); // Check if text fits

             doc.text(splitText, leftMargin + (options.indent || 0), yPos);
             yPos += (splitText.length * lineHeight) + spacing;
         }


         function checkPageBreak(requiredHeight) {
             if (yPos + requiredHeight > 280) {
                 doc.addPage();
                 yPos = 15; // Reset Y pos for new page
                 // Might want to redraw header on new page if needed for multi-page docs
                 // addHeader(); // Uncomment if header needed on all pages
             }
         }

         function addFooter() {
             const pageCount = doc.internal.getNumberOfPages();
             for (let i = 1; i <= pageCount; i++) {
                 doc.setPage(i);
                 doc.setFontSize(8);
                 doc.setTextColor(...secondaryColor);
                 doc.text(`Page ${i} of ${pageCount}`, 210 / 2, 290, { align: 'center' });
                 doc.text(`Quotation prepared by ${companyName}`, leftMargin, 290);
             }
         }

        // --- Build PDF Document ---
        addHeader();

        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...primaryColor);
        doc.text("Prepared For:", leftMargin, yPos);
        doc.text("Date Issued:", leftMargin + contentWidth / 2 + 10, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...secondaryColor);
        doc.text(customerName, leftMargin, yPos);
        doc.text(quoteDate, leftMargin + contentWidth / 2 + 10, yPos);
        yPos += 8;

        addSectionTitle("Project Overview");
        addBodyText(projectOverview);

        addSectionTitle("Investment Breakdown");
        const tableBodyData = pricingItems.map(item => [item.name, `Rs. ${parseFloat(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]);
        const tableFooterData = [
             [{ content: 'Subtotal', styles: { halign: 'right', fontStyle: 'bold'} }, { content: formattedSubtotal, styles: { halign: 'right', fontStyle: 'bold' } }],
             [{ content: 'Discount', styles: { halign: 'right', fontStyle: 'bold'} }, { content: formattedDiscount, styles: { halign: 'right', fontStyle: 'bold' } }],
             [{ content: 'Total Investment', styles: { halign: 'right', fontStyle: 'bold', fillColor: headerBgColor } }, { content: formattedTotal, styles: { halign: 'right', fontStyle: 'bold', fillColor: headerBgColor } }],
        ];

        // Check if autoTable method exists before calling
        if (doc.autoTable) {
             doc.autoTable({
                 startY: yPos,
                 head: [['Item / Service Description', 'Price (INR)']],
                 body: tableBodyData,
                 foot: tableFooterData,
                 theme: 'grid',
                 styles: { fontSize: 9, cellPadding: 2.5, valign: 'middle', lineColor: [220, 220, 220], lineWidth: 0.1, },
                 headStyles: { fillColor: tableHeaderBg, textColor: tableHeaderColor, fontStyle: 'bold', fontSize: 9.5, },
                 footStyles: { textColor: primaryColor, fontSize: 9.5, lineColor: [180, 180, 180], lineWidth: 0.2, },
                 columnStyles: { 0: { cellWidth: 'auto' }, 1: { halign: 'right', cellWidth: 35 } },
                 margin: { left: leftMargin, right: leftMargin }
             });
             yPos = doc.autoTable.previous.finalY + 5;
        } else {
            // Fallback if autoTable is not loaded
            addBodyText("Pricing table could not be generated (missing plugin).");
            console.warn("jsPDF-AutoTable not found, cannot draw pricing table.");
        }


        addSectionTitle("Estimated Project Timeline");
        const timelineBodyData = timeline.map(p => [ p.phase, p.start ? new Date(p.start).toLocaleDateString('en-IN') : 'TBD', p.end ? new Date(p.end).toLocaleDateString('en-IN') : 'TBD' ]);
        if (doc.autoTable) {
            doc.autoTable({
                 startY: yPos,
                 head: [['Phase', 'Est. Start Date', 'Est. End Date']],
                 body: timelineBodyData,
                 theme: 'grid',
                 styles: { fontSize: 9, cellPadding: 2.5, lineColor: [220, 220, 220], lineWidth: 0.1, },
                 headStyles: { fillColor: tableHeaderBg, textColor: tableHeaderColor, fontStyle: 'bold', fontSize: 9.5 },
                 margin: { left: leftMargin, right: leftMargin }
             });
             yPos = doc.autoTable.previous.finalY + 5;
        } else {
             addBodyText("Timeline table could not be generated (missing plugin).");
              console.warn("jsPDF-AutoTable not found, cannot draw timeline table.");
        }


        addSectionTitle("Payment Schedule");
        addBodyText(`1. Advance Upon Signing: ${paymentAdvance}`, {indent: 5, spacing: 1});
        addBodyText(`2. Upon Development Completion: ${paymentCompletion}`, {indent: 5, spacing: 1});
        addBodyText(`3. Upon Final Delivery/Launch: ${paymentDelivery}`, {indent: 5, spacing: 1});
        yPos += 5;

        addSectionTitle("Terms & Conditions");
        addBodyText(termsConditions, {fontSize: 8});

        addSectionTitle("Ownership & IP");
        addBodyText(ownershipIp, {fontSize: 8});

        addFooter();
        doc.save(`Quotation_${customerName.replace(/\s+/g, '_') || 'Project'}_${quoteDate.replace(/\s+/g, '-')}.pdf`);

    }); // End generatePdfButton listener

    // Initialize total price on load
    updateTotalPrice();

}); // End DOMContentLoaded