let currentAlumniData = null;

async function init() {
    showLoading(true);

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            showError("Please log in to view alumni connections.");
            showLoading(false);
            return;
        }

        const { data: currentAlumni, error: profileError } = await supabase
            .from('logged_in_alumni')
            .select('*')
            .eq('email', user.email)
            .single();

        if (profileError || !currentAlumni) {
            showError("Could not find your alumni profile. Please update your profile first.");
            showLoading(false);
            return;
        }

        currentAlumniData = currentAlumni;

        await fetchAndRenderAlumni();
    } catch (error) {
        console.error("Initialization error:", error);
        showError("An unexpected error occurred. Please try again later.");
        showLoading(false);
    }
}

async function fetchAndRenderAlumni() {
    showLoading(true);
    const container = document.getElementById("alumni-container");
    container.innerHTML = "";
    hideError();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        let query = supabase.from('alumni_profiles').select('*');

        // Dynamic Filters
        const searchName = document.getElementById('search-name').value.trim().toLowerCase();
        const filterDept = document.getElementById('filter-department').value;
        const filterCompany = document.getElementById('filter-company').value;
        const filterYear = document.getElementById('filter-year').value;

        // Apply filters if any are set
        if (filterDept || filterCompany || filterYear || searchName) {
            if (filterDept) query = query.eq('department', filterDept);
            if (filterCompany) query = query.eq('company', filterCompany);
            if (filterYear) query = query.eq('graduation_year', filterYear);
            if (searchName) query = query.ilike('name', `%${searchName}%`);
        } else {
            // Apply matching conditions based on the logged in user
            let orQuery = `department.eq.${currentAlumniData.department},company.eq.${currentAlumniData.company}`;
            if (currentAlumniData.industry) {
                orQuery += `,industry.eq.${currentAlumniData.industry}`;
            }
            query = query.or(orQuery);
        }

        const { data: matchedAlumni, error } = await query;

        if (error) throw error;

        // Step 4: Remove self from results
        const filtered = matchedAlumni.filter(a => a.email !== user.email);

        if (filtered.length === 0) {
            showError("No matching alumni found based on current criteria.");
        } else {
            renderAlumni(filtered);
            showLoading(false);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        showError("Failed to fetch alumni data.");
        showLoading(false);
    }
}

function renderAlumni(alumniList) {
    const container = document.getElementById("alumni-container");
    container.innerHTML = "";

    alumniList.forEach(alumni => {
        // Fallback for profile photo
        const photoUrl = alumni.profile_photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600';
        
        const linkedinHtml = alumni.linkedin 
            ? `<a href="${alumni.linkedin}" target="_blank" class="inst-btn inst-btn-outline" style="color: var(--inst-maroon); border-color: var(--inst-maroon); padding: 0.5rem 1rem; font-size: 0.8rem;">LinkedIn</a>` 
            : '';

        const card = `
            <div class="editorial-card">
                <img src="${photoUrl}" alt="${alumni.name}" />
                <div class="card-content">
                    <h3>${alumni.name}</h3>
                    <p style="font-weight: 500; color: var(--inst-text-main);">${alumni.role} @ ${alumni.company}</p>
                    <p>${alumni.department}</p>
                    <p style="font-size: 0.85rem;">Class of ${alumni.graduation_year}</p>
                    <div class="card-actions">
                        ${linkedinHtml}
                        <button class="inst-btn inst-btn-primary" style="background-color: var(--inst-maroon); color: white; padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="connectWith('${alumni.id}')">Connect</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function connectWith(alumniId) {
    alert("Connection request sent!");
}

function showLoading(isLoading) {
    const loader = document.getElementById("loading-container");
    const container = document.getElementById("alumni-container");
    const errorContainer = document.getElementById("error-container");
    
    if (isLoading) {
        loader.style.display = "block";
        container.style.display = "none";
        errorContainer.style.display = "none";
    } else {
        loader.style.display = "none";
        container.style.display = "grid";
    }
}

function showError(message) {
    const errorContainer = document.getElementById("error-container");
    const container = document.getElementById("alumni-container");
    const loader = document.getElementById("loading-container");
    
    loader.style.display = "none";
    errorContainer.innerText = message;
    errorContainer.style.display = "block";
    container.style.display = "none";
}

function hideError() {
    const errorContainer = document.getElementById("error-container");
    errorContainer.style.display = "none";
}

// Event Listeners for Filters
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('apply-filters').addEventListener('click', fetchAndRenderAlumni);
    
    // Add enter key support for search
    document.getElementById('search-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchAndRenderAlumni();
        }
    });

    // Start initialization
    init();
});
