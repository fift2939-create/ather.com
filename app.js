document.addEventListener('DOMContentLoaded', () => {
    // API Key & Configuration
    const GEMINI_API_KEY = "AIzaSyCj0oDJV0MljYh1Y-NDTyur0Utvz7UPxeo";

    // State management
    const state = {
        step: 1,
        projectInfo: { idea: '', country: '', language: 'ar', currency: 'USD' },
        analysis: null,
        ideas: [],
        selectedIdea: null,
        proposal: null,
        budget: [],
        chart: null
    };

    // Dictionary for i18n
    const i18n = {
        ar: {
            slogan: "أثر | لأن التغيير يبدأ بخطة",
            hero: "نساعدك على تحويل فكرتك الإنسانية إلى مشروع يترك أثرًا حقيقيًا",
            analyze: "تحليل الفكرة ⚡",
            analyzing: "قيد التنفيذ...",
            nextToIdeas: "عرض الخطط والمقترحات ✨",
            ideasStep: "الأفكار",
            proposalStep: "المقترح",
            budgetStep: "الميزانية",
            exportStep: "التصدير",
            analysisTitle: "نتائج التحليل الأولي",
            sector: "نطاق العمل",
            target: "الفئة المستهدفة",
            challenges: "تحديات البيئة",
            grandTotal: "الإجمالي التقديري الكلي",
            prev: "السابق",
            contProposal: "الاستمرار للمقترح 📝",
            prepBudget: "إعداد الميزانية 💰",
            nextExport: "المعاينة والتصدير 📤",
            placeholderIdea: "اكتب وصفاً مختصراً لفكرة المشروع الإنسانية...",
            placeholderCountry: "حدد الدولة والمنطقة الجغرافية",
            labelIdea: "وصف الفكرة الإنسانية",
            labelCountry: "النطاق الجغرافي",
            labelLang: "لغة المحتوى",
            labelCurrency: "عملة التقييم",
            smartEdit: "✨ مساعد التعديل",
            finalPreviewTitle: "مقترح مشروع إنساني",
            loadingIdeas: "جاري تحميل الخطط البديلة...",
            loadingProposal: "قيد صياغة المقترح الكامل...",
            loadingBudget: "جاري إعداد بنود الميزانية...",
            saveLocally: "💾 حفظ المشروع محلياً",
            savedSuccess: "تم حفظ المشروع بنجاح في ذاكرة المتصفح!",
            chartTitle: "توزيع الميزانية",
            otherIdeas: "💡 غير ذلك"
        },
        en: {
            slogan: "Athar | Because Change Starts with a Plan",
            hero: "Helping you transform your humanitarian idea into a project with real impact",
            analyze: "Analyze Concept ⚡",
            analyzing: "Processing...",
            nextToIdeas: "View Alternative Plans ✨",
            ideasStep: "Concepts",
            proposalStep: "Proposal",
            budgetStep: "Budget",
            exportStep: "Export",
            analysisTitle: "Initial Analysis",
            sector: "Field of Work",
            target: "Target Beneficiaries",
            challenges: "Environmental Challenges",
            grandTotal: "Total Estimated Budget",
            prev: "Previous",
            contProposal: "Continue to Proposal 📝",
            prepBudget: "Prepare Budget 💰",
            nextExport: "Preview & Export 📤",
            placeholderIdea: "Describe your humanitarian project idea briefly...",
            placeholderCountry: "Select country & region",
            labelIdea: "Project Concept",
            labelCountry: "Geographic Scope",
            labelLang: "Language",
            labelCurrency: "Currency",
            smartEdit: "✨ Edit Assistant",
            finalPreviewTitle: "Humanitarian Proposal",
            loadingIdeas: "Loading alternative plans...",
            loadingProposal: "Drafting full proposal...",
            loadingBudget: "Preparing budget items...",
            saveLocally: "💾 Save Locally",
            savedSuccess: "Project saved successfully!",
            chartTitle: "Budget Allocation",
            otherIdeas: "💡 Others"
        }
    };

    // UI Elements
    const sections = document.querySelectorAll('.section');
    const steps = document.querySelectorAll('.step');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analysisResult = document.getElementById('analysisResult');
    const ideasGrid = document.getElementById('ideasGrid');
    const generateProposalBtn = document.getElementById('generateProposalBtn');
    const proposalContent = document.getElementById('proposalContent');
    const budgetBody = document.getElementById('budgetBody');
    const grandTotalEl = document.getElementById('grandTotal');
    const finalPreview = document.getElementById('finalPreview');
    const languageSelect = document.getElementById('language');
    const currencySelect = document.getElementById('currency');
    const viewSavedProjectsBtn = document.getElementById('viewSavedProjects');
    const saveProjectBtn = document.getElementById('saveProjectBtn');
    const regenerateIdeasBtn = document.getElementById('regenerateIdeasBtn');
    const smartEditBtn = document.getElementById('smartEditBtn');
    const chatSidebar = document.getElementById('chatSidebar');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');

    // i18n Update function
    const updateLanguage = (lang) => {
        const t = i18n[lang];
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        const sloganEl = document.querySelector('.logo-slogan');
        if (sloganEl) sloganEl.innerText = t.slogan;

        const heroH1 = document.querySelector('.hero-section h1');
        if (heroH1) heroH1.innerText = t.hero;

        const labels = {
            'projectIdea': t.labelIdea,
            'country': t.labelCountry,
            'language': t.labelLang,
            'currency': t.labelCurrency
        };

        for (const id in labels) {
            const labelEl = document.querySelector(`label[for="${id}"]`);
            if (labelEl) labelEl.innerText = labels[id];
        }

        const ideaInput = document.getElementById('projectIdea');
        if (ideaInput) ideaInput.placeholder = t.placeholderIdea;

        const countryInput = document.getElementById('country');
        if (countryInput) countryInput.placeholder = t.placeholderCountry;

        if (analyzeBtn) analyzeBtn.innerText = t.analyze;

        steps.forEach((s, i) => {
            const stepNames = [i18n[lang].analysisTitle, i18n[lang].ideasStep, i18n[lang].proposalStep, i18n[lang].budgetStep, i18n[lang].exportStep];
            if (s.querySelector('span')) s.querySelector('span').innerText = stepNames[i];
        });

        document.querySelectorAll('.prevStep').forEach(b => b.innerText = t.prev);
        if (generateProposalBtn) generateProposalBtn.innerText = t.contProposal;

        const budgetBtn = document.getElementById('goToBudgetBtn');
        if (budgetBtn) budgetBtn.innerText = t.prepBudget;

        const exportBtn = document.getElementById('goToExportBtn');
        if (exportBtn) exportBtn.innerText = t.nextExport;

        if (smartEditBtn) smartEditBtn.innerText = t.smartEdit;
        if (saveProjectBtn) saveProjectBtn.innerText = t.saveLocally;
        if (regenerateIdeasBtn) regenerateIdeasBtn.innerText = t.otherIdeas;
    };

    // --- AI GATEWAY UI (The Visual Map) ---
    const updateGatewayStatus = (status, info = "") => {
        const logoSlogan = document.querySelector('.logo-slogan');
        if (!logoSlogan) return;

        let statusEl = document.getElementById('ai-status-indicator');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'ai-status-indicator';
            statusEl.style.fontSize = '0.7rem';
            statusEl.style.marginTop = '4px';
            statusEl.style.display = 'flex';
            statusEl.style.alignItems = 'center';
            statusEl.style.gap = '5px';
            logoSlogan.parentElement.appendChild(statusEl);
        }

        const isAr = state.projectInfo.language === 'ar';
        const colors = { mapping: '#f59e0b', connected: '#10b981', error: '#f43f5e' };
        const labels = isAr ? { mapping: 'جاري رسم خارطة الاتصال...', connected: 'البوابة الذكية متصلة', error: 'عائق في البوابة' }
            : { mapping: 'Mapping AI Paths...', connected: 'AI Gateway Connected', error: 'Gateway Obstacle' };

        statusEl.style.color = colors[status];
        statusEl.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:${colors[status]}; display:inline-block; animation: pulse 1.5s infinite;"></span> ${labels[status]} ${info}`;
    };

    languageSelect.addEventListener('change', (e) => {
        state.projectInfo.language = e.target.value;
        updateLanguage(state.projectInfo.language);
        updateGatewayStatus('connected');
    });

    // --- AI GATEWAY STRATEGY (Technical Rescue Mode) ---
    const AIGateway = {
        bestEndpoint: null,
        lastTechError: "",

        async call(prompt, config = {}) {
            const endpoints = [
                { ver: 'v1beta', mod: 'gemini-1.5-flash-latest' },
                { ver: 'v1beta', mod: 'gemini-1.5-flash' },
                { ver: 'v1', mod: 'gemini-1.5-flash' },
                { ver: 'v1beta', mod: 'gemini-pro' }
            ];

            this.lastTechError = "";

            // 1. Connection Test (Health Check)
            const isGoogleReachable = await this.testConnectivity();
            if (!isGoogleReachable) {
                this.lastTechError = "CRITICAL_CONNECTION_BLOCK";
                updateGatewayStatus('error');
                this.reportFailure(state.projectInfo.language);
                return null;
            }

            // 2. Try best known path first
            if (this.bestEndpoint) {
                const result = await this.execute(this.bestEndpoint, prompt, config);
                if (result) {
                    updateGatewayStatus('connected');
                    return result;
                }
            }

            // 3. Robust Mapping
            updateGatewayStatus('mapping');
            for (const ep of endpoints) {
                const result = await this.execute(ep, prompt, config);
                if (result) {
                    this.bestEndpoint = ep;
                    updateGatewayStatus('connected', `(${ep.mod})`);
                    return result;
                }
            }

            updateGatewayStatus('error');
            this.reportFailure(state.projectInfo.language);
            return null;
        },

        async testConnectivity() {
            try {
                // Testing if the browser can even see Google APIs domain
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const test = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + GEMINI_API_KEY, {
                    method: 'GET',
                    mode: 'no-cors',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                return true;
            } catch (e) { return false; }
        },

        async execute(endpoint, prompt, config) {
            const URL = `https://generativelanguage.googleapis.com/${endpoint.ver}/models/${endpoint.mod}:generateContent?key=${GEMINI_API_KEY}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 35000);

            try {
                const response = await fetch(URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    mode: "cors",
                    signal: controller.signal,
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: config.temperature || 0.7,
                            maxOutputTokens: config.maxTokens || 4096,
                        }
                    })
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
                }

                const err = await response.json().catch(() => ({}));
                this.lastTechError = err.error?.message || `Status ${response.status}`;
                return null;
            } catch (e) {
                clearTimeout(timeoutId);
                this.lastTechError = e.message === "Failed to fetch" ? "NETWORK_BLOCKADE" : e.name === 'AbortError' ? "Timeout" : e.message;
                return null;
            }
        },

        reportFailure(lang) {
            const isAr = lang === 'ar';
            let detail = this.lastTechError;

            let advice = "";
            if (detail === "NETWORK_BLOCKADE" || detail === "CRITICAL_CONNECTION_BLOCK") {
                advice = isAr
                    ? "🚨 عائق شبكة حرج (Failed to fetch):\n\nلقد رصد نظامنا أن متصفحك يمنع الوصول لخوادم جوجل. يرجى:\n1. إيقاف مانع الإعلانات (AdBlock / uBlock) فوراً.\n2. التأكد أن الـ VPN مفعل على دولة (أمريكا/ألمانيا).\n3. إذا كنت تفتح الملف كملف محلي (file://)، يرجى رفعه على GitHub Pages ليعمل بشكل صحيح."
                    : "🚨 Critical Network Block (Failed to fetch):\n\nOur system detected that your browser is blocking Google AI Servers. Please:\n1. Disable AdBlockers (uBlock/AdBlock) immediately.\n2. Ensure VPN is active and set to USA/Germany.\n3. If opening as a local file (file://), please upload to GitHub Pages for it to work correctly.";
            } else if (detail.includes("location") || detail.includes("supported")) {
                advice = isAr
                    ? "📍 الدولة غير مدعومة:\n\nجوجل لا تسمح بالوصول من دولتك الحالية. يرجى تغيير الـ VPN إلى (الولايات المتحدة الأمريكية) ثم تحديث الصفحة."
                    : "📍 Region Not Supported:\n\nGoogle AI is blocked in your current region. Please switch your VPN to (USA) and refresh the page.";
            } else {
                advice = isAr
                    ? `⚠️ عائق فني: ${detail}\n\nيرجى التأكد من أن مفتاح الـ API مفعّل وصحيح، وتأكد من استقرار الإنترنت.`
                    : `⚠️ Technical Obstacle: ${detail}\n\nEnsure your API key is active and check your internet stability.`;
            }

            alert(advice);
        }
    };

    async function callGemini(prompt, config = {}) {
        return await AIGateway.call(prompt, config);
    }

    // Robust JSON Extractor Helper
    function extractJSON(text) {
        try {
            const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch && codeBlockMatch[1]) return JSON.parse(codeBlockMatch[1].trim());
            const bracketMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (bracketMatch && bracketMatch[0]) return JSON.parse(bracketMatch[0].trim());
            return JSON.parse(text.trim());
        } catch (e) {
            console.error("JSON Extraction failed:", e);
            return null;
        }
    }

    // Navigation Logic
    const goToStep = (stepNum) => {
        state.step = stepNum;
        const hero = document.querySelector('.hero-section');
        if (hero) {
            if (stepNum > 1) hero.classList.add('hidden');
            else hero.classList.remove('hidden');
        }

        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`step${stepNum}`);
        if (target) target.classList.add('active');

        steps.forEach(s => {
            const sNum = parseInt(s.dataset.step);
            s.classList.remove('active', 'completed');
            if (sNum < stepNum) s.classList.add('completed');
            if (sNum === stepNum) s.classList.add('active');
        });

        if (stepNum > 1) {
            document.querySelector('#mainStepper').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    document.querySelectorAll('.prevStep').forEach(btn => {
        btn.addEventListener('click', () => goToStep(state.step - 1));
    });

    // Module 1: Analysis
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            state.projectInfo.idea = document.getElementById('projectIdea').value;
            state.projectInfo.country = document.getElementById('country').value;
            state.projectInfo.language = document.getElementById('language').value;
            state.projectInfo.currency = document.getElementById('currency').value;

            if (!state.projectInfo.idea) return alert(state.projectInfo.language === 'ar' ? 'يرجى إدخال فكرة المشروع' : 'Please enter project idea');

            const t = i18n[state.projectInfo.language];
            analyzeBtn.innerHTML = t.analyzing;
            analyzeBtn.disabled = true;

            const prompt = `أنت خبير في كتابة المشاريع الإنسانية والتحليل التنموي. حلل الفكرة التالية بدقة واقعية: "${state.projectInfo.idea}" في الدولة: "${state.projectInfo.country}" باللغة: "${state.projectInfo.language === 'ar' ? 'العربية' : 'الإنجليزية'}". 
            اعتمد على بيانات جغرافية واجتماعية حقيقية لهذه المنطقة.
            قم بالرد بتنسيق JSON حصراً كالتالي:
            { "sector": "القطاع الإنساني بدقة", "target": "الفئة المستهدفة الحقيقية", "challenges": "التحديات اللوجستية والبيئية في المنطقة", "summary": "ملخص تحليلي استراتيجي للموقف" }`;

            const response = await callGemini(prompt, { temperature: 0.5 });
            let analysis = response ? extractJSON(response) : null;

            if (!analysis) {
                analyzeBtn.innerHTML = t.analyze;
                analyzeBtn.disabled = false;
                return;
            }

            state.analysis = analysis;
            analysisResult.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent); padding: 25px; border-radius: 12px; animation: fadeIn 0.5s ease;">
                    <h4 style="color: var(--accent); margin-bottom: 15px; font-size: 1.2em;">${t.analysisTitle}</h4>
                    <p><strong>${t.sector}:</strong> ${analysis.sector}</p>
                    <p><strong>${t.target}:</strong> ${analysis.target}</p>
                    <p><strong>${t.challenges}:</strong> ${analysis.challenges}</p>
                    <div style="margin-top: 20px; font-style: italic; color: var(--text-primary); border-top: 1px solid var(--glass-border); padding-top: 15px;">${analysis.summary}</div>
                    <button id="nextToIdeas" class="btn btn-primary" style="margin-top: 20px; width: 100%; justify-content: center;">${t.nextToIdeas}</button>
                </div>
            `;
            analysisResult.style.display = 'block';
            analyzeBtn.innerHTML = t.analyze;
            analyzeBtn.disabled = false;

            const nextBtn = document.getElementById('nextToIdeas');
            if (nextBtn) {
                nextBtn.onclick = () => {
                    generateIdeas();
                    goToStep(2);
                };
            }
        });
    }

    // Module 2: Ideas Generation
    async function generateIdeas() {
        const lang = state.projectInfo.language;
        const t = i18n[lang];
        if (ideasGrid) {
            ideasGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 60px;">
                <p style="margin-bottom: 20px;">${t.loadingIdeas}</p>
            </div>`;
        }

        const prompt = `ابتكر من 3 إلى 5 أفكار مشاريع إنسانية حقيقية ومبتكرة تماماً بناءً على هذا التحليل السيادي: ${JSON.stringify(state.analysis)} في منطقة ${state.projectInfo.country} باللغة ${lang}.
        مهم جداً: لا تكرر الأفكار السابقة، ابحث عن حلول خارج الصندوق.
        يجب أن يكون الرد JSON حصراً: [ { "name": "اسم المشروع المبتكر", "description": "وصف تقني وعملي مفصل", "goal": "الأثر المتوقع القابل للقياس" } ]`;

        const response = await callGemini(prompt, { temperature: 0.8 });
        let ideas = response ? extractJSON(response) : null;

        if (!ideas || !Array.isArray(ideas)) {
            if (ideasGrid) {
                ideasGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--danger);">
                    <p>${lang === 'ar' ? 'فشل في توليد أفكار جديدة.' : 'Failed to generate ideas.'}</p>
                    <button class="btn btn-primary" onclick="generateIdeas()">${lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
                </div>`;
            }
            return;
        }

        state.ideas = ideas;
        if (ideasGrid) {
            ideasGrid.innerHTML = '';
            ideas.forEach((idea) => {
                const card = document.createElement('div');
                card.className = 'glass-card idea-card';
                card.style.padding = '25px';
                card.innerHTML = `
                    <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 1.25rem;">${idea.name}</h3>
                    <p style="font-size: 1rem; margin-bottom: 15px; color: var(--text-secondary); line-height: 1.7;">${idea.description}</p>
                    <div style="padding-top: 15px; border-top: 1px solid var(--glass-border); font-size: 0.9rem; color: var(--text-primary);">
                        <strong>🎯 ${lang === 'ar' ? 'الهدف المحوري' : 'Goal'}:</strong> ${idea.goal}
                    </div>
                `;
                card.onclick = () => {
                    document.querySelectorAll('.idea-card').forEach(c => {
                        c.style.borderColor = 'var(--glass-border)';
                        c.style.transform = 'scale(1)';
                    });
                    card.style.borderColor = 'var(--primary)';
                    card.style.transform = 'scale(1.02)';
                    state.selectedIdea = idea;
                    if (generateProposalBtn) generateProposalBtn.disabled = false;
                };
                ideasGrid.appendChild(card);
            });
        }
    }

    if (regenerateIdeasBtn) regenerateIdeasBtn.onclick = () => generateIdeas();

    if (generateProposalBtn) {
        generateProposalBtn.onclick = async () => {
            generateProposalBtn.innerText = i18n[state.projectInfo.language].analyzing;
            generateProposalBtn.disabled = true;
            await generateFullProposal();
            generateProposalBtn.innerText = i18n[state.projectInfo.language].contProposal;
            generateProposalBtn.disabled = false;
            goToStep(3);
        };
    }

    // Module 3: Full Proposal
    async function generateFullProposal() {
        const lang = state.projectInfo.language;
        const t = i18n[lang];
        if (proposalContent) proposalContent.innerHTML = `<p style="text-align:center; padding: 40px;">${t.loadingProposal}</p>`;

        const prompt = `قم بصياغة مقترح مشروع إنساني متكامل ومحترف جداً للمانحين لمشروع "${state.selectedIdea.name}" في "${state.projectInfo.country}" باللغة ${lang}. 
        يجب أن يحتوي المقترح على الأقسام التالية: (الملخص التنفيذي، الخلفية والاحتياج، بيان المشكلة، الأهداف الاستراتيجية، الفئات المستهدفة، الأنشطة الميدانية، المنهجية، النتائج المتوقعة، الاستدامة، المخاطر، الخاتمة).
        الرد بصيغة JSON حصراً كالتالي: { "اسم القسم": "محتوى احترافي ومحفز ومفصل" }`;

        const response = await callGemini(prompt, { temperature: 0.8 });
        let proposal = response ? extractJSON(response) : null;

        if (!proposal) return;

        state.proposal = proposal;
        if (proposalContent) {
            proposalContent.innerHTML = '';
            for (const section in proposal) {
                const div = document.createElement('div');
                div.className = 'proposal-sec bounce-in';
                div.style.marginBottom = '35px';
                div.innerHTML = `
                    <h4 style="color: var(--primary); border-right: 5px solid var(--primary); padding-right: 18px; margin-bottom: 15px; font-weight: 800; font-size: 1.1rem;">${section}</h4>
                    <div contenteditable="true" data-key="${section}" class="proposal-edit-area" style="white-space: pre-line; line-height: 1.9; color: var(--text-primary); text-align: justify; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.01);">${proposal[section]}</div>
                `;
                proposalContent.appendChild(div);
            }

            proposalContent.querySelectorAll('.proposal-edit-area').forEach(div => {
                div.oninput = () => {
                    const key = div.getAttribute('data-key');
                    state.proposal[key] = div.innerText;
                };
            });
        }
    }

    // Smart Edit
    if (smartEditBtn) {
        smartEditBtn.onclick = () => {
            if (chatSidebar) chatSidebar.style.display = chatSidebar.style.display === 'none' ? 'block' : 'none';
        };
    }

    if (sendChatBtn) {
        sendChatBtn.onclick = async () => {
            const instruction = chatInput.value.trim();
            if (!instruction) return;
            sendChatBtn.disabled = true;
            const prompt = `بناءً على هذا المقترح: ${JSON.stringify(state.proposal)}
            نفذ الطلب التالي: "${instruction}"
            الرد بنفس هيكل JSON السابق تماماً.`;
            const response = await callGemini(prompt);
            if (response) {
                const updated = extractJSON(response);
                if (updated) {
                    state.proposal = updated;
                    if (proposalContent) {
                        proposalContent.innerHTML = '';
                        for (const section in state.proposal) {
                            const div = document.createElement('div');
                            div.className = 'proposal-sec bounce-in';
                            div.style.marginBottom = '35px';
                            div.innerHTML = `
                                <h4 style="color: var(--primary); border-right: 5px solid var(--primary); padding-right: 18px; margin-bottom: 15px; font-weight: 800; font-size: 1.1rem;">${section}</h4>
                                <div contenteditable="true" data-key="${section}" style="white-space: pre-line; line-height: 1.9; color: var(--text-primary); text-align: justify; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.01);">${state.proposal[section]}</div>
                            `;
                            proposalContent.appendChild(div);
                        }
                    }
                    if (chatInput) chatInput.value = '';
                    if (chatSidebar) chatSidebar.style.display = 'none';
                }
            }
            sendChatBtn.disabled = false;
        };
    }

    // Module 4: Budget
    const budgetNavBtn = document.getElementById('goToBudgetBtn');
    if (budgetNavBtn) {
        budgetNavBtn.onclick = async () => {
            budgetNavBtn.innerText = i18n[state.projectInfo.language].analyzing;
            budgetNavBtn.disabled = true;
            await generateBudget();
            budgetNavBtn.innerText = i18n[state.projectInfo.language].prepBudget;
            budgetNavBtn.disabled = false;
            goToStep(4);
        };
    }

    async function generateBudget() {
        const lang = state.projectInfo.language;
        if (budgetBody) budgetBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px;">${i18n[lang].loadingBudget}</td></tr>`;
        const prompt = `صمم ميزانية واقعية لمشروع "${state.selectedIdea.name}" باللغة "${lang}" والعملة "${state.projectInfo.currency}".
        الرد JSON حصراً: [ { "name": "اسم الفئة", "items": [ { "item": "البند", "desc": "الوصف", "qty": 10, "unit": "الوحدة", "price": 100 } ] } ]`;
        const response = await callGemini(prompt, { temperature: 0.5 });
        let categories = response ? extractJSON(response) : null;
        if (!categories) return;
        state.budget = categories;
        renderBudget();
    }

    function renderBudget() {
        if (!budgetBody) return;
        budgetBody.innerHTML = '';
        let total = 0;
        state.budget.forEach((cat) => {
            const header = document.createElement('tr');
            header.style.background = 'rgba(99, 102, 241, 0.1)';
            header.innerHTML = `<td colspan="6" style="padding: 15px; color: var(--primary); font-weight:bold;">📁 ${cat.name}</td>`;
            budgetBody.appendChild(header);

            cat.items.forEach((item) => {
                const subtotal = item.qty * item.price;
                total += subtotal;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.item}</td>
                    <td style="font-size:0.85rem; color: var(--text-secondary);">${item.desc}</td>
                    <td><input type="number" value="${item.qty}" class="qty-btn" style="width:50px; background:transparent; border:1px solid var(--glass-border); color:white;"></td>
                    <td>${item.unit}</td>
                    <td><input type="number" value="${item.price}" class="price-btn" style="width:80px; background:transparent; border:1px solid var(--glass-border); color:white;"></td>
                    <td style="color: var(--accent); font-weight:bold;">${subtotal.toLocaleString()}</td>
                `;
                budgetBody.appendChild(row);
            });
        });
        if (grandTotalEl) grandTotalEl.innerText = `${total.toLocaleString()} ${state.projectInfo.currency}`;
    }

    // Export & Final
    const exportNavBtn = document.getElementById('goToExportBtn');
    if (exportNavBtn) {
        exportNavBtn.onclick = () => {
            renderFinalPreview();
            renderAnalytics();
            goToStep(5);
        };
    }

    function renderFinalPreview() {
        if (!finalPreview) return;
        let html = `<div style="text-align:center; padding-bottom: 20px; border-bottom: 2px solid #eee; margin-bottom: 40px;">
            <h1 style="color: #1e293b;">${state.selectedIdea.name}</h1>
            <p style="color: #64748b;">${state.projectInfo.country} | ${new Date().toLocaleDateString(state.projectInfo.language)}</p>
        </div>`;
        for (const key in state.proposal) {
            html += `<h3 style="color: #4f46e5; border-right: 5px solid #4f46e5; padding-right: 15px; margin-top: 30px;">${key}</h3>`;
            html += `<p style="line-height:1.8; text-align:justify; color: #334155;">${state.proposal[key]}</p>`;
        }
        finalPreview.innerHTML = html;
    }

    function renderAnalytics() {
        const chartCanvas = document.getElementById('budgetChart');
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        const percentagesEl = document.getElementById('budgetPercentages');
        let grandTotal = 0;
        const labels = [], catTotals = [];
        state.budget.forEach(cat => {
            let catTotal = cat.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
            grandTotal += catTotal;
            catTotals.push(catTotal);
            labels.push(cat.name);
        });
        if (state.chart) state.chart.destroy();
        state.chart = new Chart(ctx, {
            type: 'doughnut',
            data: { labels, datasets: [{ data: catTotals, backgroundColor: ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'], borderWidth: 0 }] },
            options: { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }
        });
        if (percentagesEl) {
            percentagesEl.innerHTML = labels.map((l, i) => {
                const pc = ((catTotals[i] / grandTotal) * 100).toFixed(1);
                return `<div><span>${l}</span><span style="float:left; font-weight:bold; color: var(--primary);">${pc}%</span></div>
                <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; margin: 10px 0 20px;"><div style="width:${pc}%; height:100%; background:var(--primary); border-radius:3px;"></div></div>`;
            }).join('');
        }
    }

    // Save & Load
    if (saveProjectBtn) {
        saveProjectBtn.onclick = () => {
            const projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
            projects.push({ id: Date.now(), date: new Date().toISOString(), info: state.projectInfo, idea: state.selectedIdea, proposal: state.proposal, budget: state.budget });
            localStorage.setItem('athar_projects', JSON.stringify(projects));
            alert(i18n[state.projectInfo.language].savedSuccess);
        };
    }

    if (viewSavedProjectsBtn) {
        viewSavedProjectsBtn.onclick = () => {
            renderSavedProjects();
            goToStep(6);
        };
    }

    function renderSavedProjects() {
        const grid = document.getElementById('savedProjectsGrid');
        if (!grid) return;
        const projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
        grid.innerHTML = projects.length ? '' : '<p style="text-align:center;">لا توجد مشاريع محفوظة.</p>';
        projects.reverse().forEach(p => {
            const card = document.createElement('div');
            card.className = 'glass-card'; card.style.padding = '20px';
            card.innerHTML = `<h4>${p.idea.name}</h4><p style="font-size:0.8rem;">📍 ${p.info.country} • ${new Date(p.date).toLocaleDateString()}</p>
            <div style="margin-top:15px; display:flex; gap:10px;">
                <button class="btn btn-primary btn-sm" onclick="loadProject(${p.id})">فتح</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deleteProject(${p.id})">🗑️</button>
            </div>`;
            grid.appendChild(card);
        });
    }

    window.loadProject = (id) => {
        const projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
        const p = projects.find(x => x.id === id);
        if (!p) return;
        state.projectInfo = p.info; state.selectedIdea = p.idea; state.proposal = p.proposal; state.budget = p.budget;
        renderFinalPreview(); renderAnalytics(); renderBudget(); goToStep(5);
    };

    window.deleteProject = (id) => {
        let projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
        projects = projects.filter(x => x.id !== id);
        localStorage.setItem('athar_projects', JSON.stringify(projects));
        renderSavedProjects();
    };

    // Export Logic
    const wordBtn = document.getElementById('exportWordBtn');
    if (wordBtn) {
        wordBtn.onclick = () => {
            const content = `<!DOCTYPE html><html lang="${state.projectInfo.language}" dir="${state.projectInfo.language === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><style>body { font-family: Arial; padding: 50px; } h1 { color: #1e293b; text-align: center; } h3 { color: #4f46e5; margin-top: 30px; } p { text-align: justify; line-height: 1.6; }</style></head><body>${finalPreview.innerHTML}</body></html>`;
            const blob = htmlDocx.asBlob(content);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `${state.selectedIdea.name}.docx`; a.click();
        };
    }

    const excelBtn = document.getElementById('exportExcelBtn');
    if (excelBtn) {
        excelBtn.onclick = () => {
            const workbook = XLSX.utils.book_new();
            const data = [["تقرير الميزانية"], ["المشروع:", state.selectedIdea.name], ["الدولة:", state.projectInfo.country], [], ["الفئة", "البند", "الوصف", "الكمية", "الوحدة", "السعر", "الإجمالي"]];
            let total = 0;
            state.budget.forEach(c => c.items.forEach(i => { const l = i.qty * i.price; total += l; data.push([c.name, i.item, i.desc, i.qty, i.unit, i.price, l]); }));
            data.push([], ["", "", "", "", "", "الإجمالي الكلي", total]);
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(data), "Budget");
            XLSX.writeFile(workbook, `Budget_${state.selectedIdea.name}.xlsx`);
        };
    }

    updateLanguage(state.projectInfo.language);
    updateGatewayStatus('connected');
});
