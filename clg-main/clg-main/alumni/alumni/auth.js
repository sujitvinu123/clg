/**
 * auth.js - Authentication Implementation
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase Client
    if (!window.supabase) {
        console.error('Supabase library not loaded. Ensure CDN is included in index.html');
        return;
    }

    if (!window.CONFIG.SUPABASE_URL || window.CONFIG.SUPABASE_URL.includes('YOUR_')) {
        console.warn('Supabase URL/Key missing. Please configure config.js');
    }

    const supabaseUrl = window.CONFIG.SUPABASE_URL;
    const supabaseKey = window.CONFIG.SUPABASE_ANON_KEY;
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // DOM Elements
    const portalLoginBtn = document.getElementById('portalLoginBtn');
    const authModalOverlay = document.getElementById('authModalOverlay');
    const authModalClose = document.getElementById('authModalClose');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    // UI Helpers
    const toggleModal = (show) => {
        if (show) {
            authModalOverlay.classList.add('active');
        } else {
            authModalOverlay.classList.remove('active');
        }
    };

    const setAuthMessage = (formId, isError, message) => {
        const errorEl = document.getElementById(formId === 'signInForm' ? 'signinError' : 'signupError');
        const successEl = document.getElementById(formId === 'signInForm' ? 'signinSuccess' : 'signupSuccess');
        
        if (isError) {
            if (errorEl) {
                errorEl.innerText = message;
                errorEl.style.display = 'block';
            }
            if (successEl) successEl.style.display = 'none';
        } else {
            if (errorEl) errorEl.style.display = 'none';
            if (successEl) {
                successEl.innerText = message;
                successEl.style.display = 'block';
            }
        }
    };

    const clearAuthMessages = () => {
        const els = ['signinError', 'signupError', 'signinSuccess', 'signupSuccess'];
        els.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    };

    // Event Listeners
    if (portalLoginBtn) {
        portalLoginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            // Check current session state, if logged in, do logout instead
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Logout logic
                await supabase.auth.signOut();
            } else {
                toggleModal(true);
            }
        });
    }

    if (authModalClose) {
        authModalClose.addEventListener('click', () => toggleModal(false));
    }

    if (authModalOverlay) {
        authModalOverlay.addEventListener('click', (e) => {
            if (e.target === authModalOverlay) toggleModal(false);
        });
    }

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            const targetForm = document.getElementById(tab.dataset.tab === 'signin' ? 'signInForm' : 'signUpForm');
            if (targetForm) targetForm.classList.add('active');
            
            clearAuthMessages();
        });
    });

    // Form Submissions
    if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearAuthMessages();
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            
            const submitBtn = signInForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Signing In...';
            submitBtn.disabled = true;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            submitBtn.innerText = originalText;
            submitBtn.disabled = false;

            if (error) {
                setAuthMessage('signInForm', true, error.message);
            } else {
                // Fetch user data from alumni_profiles
                const { data: profile, error: profileError } = await supabase
                    .from('alumni_profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                const userName = profile ? profile.full_name : 'Alumni';
                setAuthMessage('signInForm', false, `Welcome back, ${userName}!`);
                
                setTimeout(() => {
                    toggleModal(false);
                    signInForm.reset();
                }, 1500);
            }
        });
    }

    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearAuthMessages();
            
            const fullName = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const batch = document.getElementById('signupBatch').value;
            const department = document.getElementById('signupDepartment').value;

            const submitBtn = signUpForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Creating Account...';
            submitBtn.disabled = true;

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                setAuthMessage('signUpForm', true, error.message);
                return;
            }

            // Insert into alumni_profiles
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('alumni_profiles')
                    .insert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            email: email,
                            batch: batch,
                            department: department
                        }
                    ]);

                submitBtn.innerText = originalText;
                submitBtn.disabled = false;

                if (profileError) {
                    setAuthMessage('signUpForm', true, 'Account created, but profile setup failed: ' + profileError.message);
                } else {
                    setAuthMessage('signUpForm', false, 'Account successfully created! You are now logged in.');
                    setTimeout(() => {
                        toggleModal(false);
                        signUpForm.reset();
                    }, 2000);
                }
            }
        });
    }

    // Session State Listener
    supabase.auth.onAuthStateChange((event, session) => {
        if (portalLoginBtn) {
            if (session) {
                portalLoginBtn.innerText = 'Logout';
                portalLoginBtn.classList.remove('active'); // in case it had active
            } else {
                portalLoginBtn.innerText = 'Portal Login';
            }
        }
    });

    // Check initial session
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && portalLoginBtn) {
            portalLoginBtn.innerText = 'Logout';
        }
    };
    checkSession();
});
