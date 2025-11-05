function createSlider(sliderSelector, intervalTime = 3000) {
    let index = 0;
    let interval;

    const slider = document.querySelector(sliderSelector);
    if (!slider) return;

    const slides = slider.querySelector(".slides");
    if (!slides) return;

    const dots = slider.parentElement.querySelectorAll(".dots .dot");

    function updateSlide() {
        slides.style.transform = `translateX(-${index * 100}%)`;

        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove("active"));
            dots[index].classList.add("active");
        }

    }

    function moveSlide(step) {
        const total = slides.children.length;
        index = (index + step + total) % total;
        updateSlide();
        resetAutoSlide();
    }

    function startAutoSlide() {
        stopAutoSlide();
        interval = setInterval(() => {
            const total = slides.children.length;
            index = (index + 1) % total;
            updateSlide();
        }, intervalTime);
    }

    function stopAutoSlide() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => goToSlide(i));
    });

    // Pause on hover
    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);

    // init
    updateSlide();
    startAutoSlide();

    return { moveSlide, startAutoSlide, stopAutoSlide };
}
window.addEventListener('DOMContentLoaded', () => {
        const yearElement = document.getElementById('year');
        if(yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    });
// Init multiple sliders
document.addEventListener("DOMContentLoaded", () => {
    window.slider1 = createSlider("#slider1", 3000); // पहिला slider (3 सेकंद)
    window.slider2 = createSlider("#slider2", 4000); // दुसरा slider (4 सेकंद)
});








/* -------------------------------------------------------start - rendering gallery images with backend------------------------------------------------------------------------------------------ */


    async function loadGallery() {
    try {
        // Replace with your correct API URL
        const apiPath = window.APP_CONFIG.apiBaseUrl;
        const resp = await fetch( apiPath + 'galleryImage');
        if (!resp.ok) {
        console.error('Gallery fetch failed', resp.status, await resp.text());
        return;
        }
        const images = await resp.json();
        renderGallery(images);
    } catch (err) {
        console.error('Error fetching gallery', err);
    }
    }

    

/*----------------------below code according to Actual old  Api  design------------------------------------*/



    function renderGallery(images) {
    const galleryGrid = document.querySelector('.photo-grid');
    if (!galleryGrid) {
        console.error('No #galleryGrid element found');
        return;
    }

    // Clear existing content
    galleryGrid.innerHTML = '';

    images.forEach(img => {
        // img.filepath is something like "/gallery/unique-filename.jpg"
        // Compose full URL if needed (for example, if your API is on another domain)
        // const apiImagePath = window.APP_CONFIG.apiImageUrl;
        const src = img.filepath;  
        const caption = img.caption || '';
        const title = img.title || '';

        // Create anchor element for lightbox
        const anchor = document.createElement('a');
        anchor.href = src;
        anchor.setAttribute('data-lightbox', 'models');
        anchor.setAttribute('data-title', caption);

        // Create image element
        const imageEl = document.createElement('img');
        imageEl.classList.add('gimg');
        imageEl.src = src;
        // imageEl.src = src;
        imageEl.alt = title;

        // Append
        anchor.appendChild(imageEl);
        galleryGrid.appendChild(anchor);
    });
    }





    /*--------------------------------------------------------Start- Complaint Form Handling------------------------------------------------------*/


     //Complaint Reason Dropdown
    
    const reason = [
      {id : 1, name : 'पाणी प्रश्न'},
      {id : 2, name : 'स्वच्छता'},
      {id : 3, name : 'गटार चेंबर'},
      {id : 4, name : 'रस्ते वाहतूक'},
      {id : 5, name : 'पथ दिवे'},
      {id : 6, name : 'घंटा गाडी'},
      {id : 7, name : 'इतर'},
      {id : 8, name : 'सुचवा'},
    ]

    const reasonDrpDown = document.getElementById('reasonDropdown');

    reason.forEach(rsn => {
      const option = document.createElement('option');
      option.value = rsn.id;
      option.textContent = rsn.name;
      reasonDrpDown.appendChild(option);
    })



    // sending Comlaint to api

    document.getElementById('complaintForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('complainterName').value;
    const number = document.getElementById('complainterNumber').value;
    const rsn = document.getElementById('reasonDropdown').value;
    const msg = document.getElementById('comlaintDesc').value;
    
    const selectedReason = reason.find(r => r.id === parseInt(rsn))?.name;
    
    const apiPath = window.APP_CONFIG.apiBaseUrl;
    const resp = await fetch(apiPath + 'complaint/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: name, Number : number, Reason : selectedReason, Description: msg })
    });
    if (resp.ok) {
        alert('Complaint sent Successfully!');
        document.getElementById('complaintForm').reset();
        // optionally close modal
    } else {
        alert('Complaint - Operation Failed!');
    }
    });

    
    /*-------------------------------------------------------- End - Complaint Form Handling------------------------------------------------------*/

    
    /*-------------------------------------------------------- Start - Notice strip Handling------------------------------------------------------*/

    

// The Marquee Strip for showing the notices

async function loadNotices() {
  try {
    const apiPath = window.APP_CONFIG.apiBaseUrl;
    const response = await fetch(apiPath + "Notice");
    const notices = await response.json();
    const noticeCount = 0;

    const marquee = document.getElementById("noticeMarquee");
    if (notices.length === 0) {
      marquee.textContent = "सध्या कोणतीही सूचना उपलब्ध नाहीत.";
      return;
    }

    const noticeTexts = notices.map((n, index) =>
      `${index + 1}) ${n.title} (${n.venue}) : 📅${n.description}`
    );

    marquee.textContent = noticeTexts.join(" || ");
  } catch (err) {
    console.error("Error loading notices:", err);
    document.getElementById("noticeMarquee").textContent = "सूचना लोड करण्यात अडचण आली.";
  }
}

// Load notices once page loads
window.addEventListener("DOMContentLoaded", loadNotices);




    /*-------------------------------------------------------- End - Notice strip Handling------------------------------------------------------*/






/* -------------------------------------------------------End - rendering gallery images with backend------------------------------------------------------------------------------------------ */









