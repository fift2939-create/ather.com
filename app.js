document.addEventListener('DOMContentLoaded', () => {
    // API Key & Configuration
    const GEMINI_API_KEY = "AIzaSyCj0oDJV0MljYh1Y-NDTyur0Utvz7UPxeo";

    // --- Global Bridge (Private Relay) ---
    const ATHAR_BRIDGE_URL = "https://script.google.com/macros/s/AKfycbwJc_EWdEdwempJGlCnO7y97Bj2Kv-BfB-lA_ciKaS-6xRe1Z6SHwxFcNnMnbZ8JNjB/exec";

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
            analyzing: "جاري المعالجة...",
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
            nextExport: "المعايير والتصدير 📤",
            placeholderIdea: "اكتب وصفاً مختصراً لفكرة المشروع الإنسانية...",
            placeholderCountry: "حدد الدولة والمنطقة الجغرافية",
            labelIdea: "وصف الفكرة الإنسانية",
            labelCountry: "النطاف الجغرافي",
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

    // UI Elements check
    const analyzeBtn = document.getElementById('analyzeBtn');
    const sections = document.querySelectorAll('.section');
    const steps = document.querySelectorAll('.step');
    const ideasGrid = document.getElementById('ideasGrid');
    const generateProposalBtn = document.getElementById('generateProposalBtn');
    const proposalContent = document.getElementById('proposalContent');
    const budgetBody = document.getElementById('budgetBody');
    const grandTotalEl = document.getElementById('grandTotal');
    const finalPreview = document.getElementById('finalPreview');
    const languageSelect = document.getElementById('language');
    const currencySelect = document.getElementById('currency');
    const saveProjectBtn = document.getElementById('saveProjectBtn');
    const regenerateIdeasBtn = document.getElementById('regenerateIdeasBtn');
    const smartEditBtn = document.getElementById('smartEditBtn');
    const chatSidebar = document.getElementById('chatSidebar');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');

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

        if (document.getElementById('projectIdea')) document.getElementById('projectIdea').placeholder = t.placeholderIdea;
        if (document.getElementById('country')) document.getElementById('country').placeholder = t.placeholderCountry;
        if (analyzeBtn) analyzeBtn.innerText = t.analyze;

        steps.forEach((s, i) => {
            const stepNames = [i18n[lang].analysisTitle, i18n[lang].ideasStep, i18n[lang].proposalStep, i18n[lang].budgetStep, i18n[lang].exportStep];
            if (s.querySelector('span')) s.querySelector('span').innerText = stepNames[i];
        });

        document.querySelectorAll('.prevStep').forEach(b => b.innerText = t.prev);
    };

    const updateGatewayStatus = (status, info = "") => {
        const logoSlogan = document.querySelector('.logo-slogan');
        if (!logoSlogan) return;
        let statusEl = document.getElementById('ai-status-indicator');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'ai-status-indicator';
            statusEl.style.fontSize = '0.7rem';
            statusEl.style.marginTop = '4px';
            statusEl.style.display = 'flex'; statusEl.style.alignItems = 'center'; statusEl.style.gap = '5px';
            logoSlogan.parentElement.appendChild(statusEl);
        }
        const isAr = state.projectInfo.language === 'ar';
        const colors = { mapping: '#f59e0b', connected: '#10b981', error: '#f43f5e' };
        const labels = isAr ? { mapping: 'جاري رسم خارطة الاتصال...', connected: 'البوابة الذكية متصلة', error: 'عائق في البوابة' }
            : { mapping: 'Mapping AI Paths...', connected: 'AI Gateway Connected', error: 'Gateway Obstacle' };
        statusEl.style.color = colors[status];
        statusEl.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:${colors[status]}; display:inline-block; animation: pulse 1.5s infinite;"></span> ${labels[status]} ${info}`;
    };

    const AIGateway = {
        bestEndpoint: null,
        lastTechError: "",
        async call(prompt, config = {}) {
            const endpoints = [];
            if (ATHAR_BRIDGE_URL) endpoints.push({ ver: 'bridge', mod: 'AI-Bridge-Relay' });
            endpoints.push(
                { ver: 'v1beta', mod: 'gemini-1.5-flash' },
                { ver: 'v1', mod: 'gemini-1.5-flash' },
                { ver: 'v1', mod: 'gemini-pro' },
                { ver: 'v1beta', mod: 'gemini-1.5-pro' }
            );
            this.lastTechError = "";
            updateGatewayStatus('mapping');
            // Try best known first
            if (this.bestEndpoint) {
                const res = await this.execute(this.bestEndpoint, prompt, config);
                if (res) return res;
            }
            // Mapping
            for (const ep of endpoints) {
                const res = await this.execute(ep, prompt, config);
                if (res) {
                    this.bestEndpoint = ep;
                    updateGatewayStatus('connected', `(${ep.mod})`);
                    return res;
                }
            }
            updateGatewayStatus('error');
            this.reportFailure(state.projectInfo.language);
            return null;
        },
        async execute(endpoint, prompt, config) {
            let URL = `https://generativelanguage.googleapis.com/${endpoint.ver}/models/${endpoint.mod}:generateContent?key=${GEMINI_API_KEY}`;
            if (endpoint.ver === 'bridge') URL = ATHAR_BRIDGE_URL;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45000);
            try {
                const response = await fetch(URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: config.temperature || 0.7, maxOutputTokens: config.maxTokens || 4096 }
                    })
                });
                clearTimeout(timeoutId);
                if (response.ok) {
                    const data = await response.json();
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || data.reply || null;
                }
                const err = await response.json().catch(() => ({}));
                this.lastTechError = err.error?.message || `Status ${response.status}`;
                return null;
            } catch (e) {
                clearTimeout(timeoutId);
                this.lastTechError = e.message;
                return null;
            }
        },
        reportFailure(lang) {
            const isAr = lang === 'ar';
            alert(isAr ? `🚨 عائق فني: ${this.lastTechError}\nيرجى تحديث الصفحة والمحاولة مرة أخرى.` : `🚨 Technical Obstacle: ${this.lastTechError}\nPlease refresh and retry.`);
        }
    };

    async function callGemini(prompt, config = {}) { return await AIGateway.call(prompt, config); }

    function extractJSON(text) {
        try {
            const codeBlock = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (codeBlock) return JSON.parse(codeBlock[1].trim());
            const bracket = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (bracket) return JSON.parse(bracket[0].trim());
            return JSON.parse(text.trim());
        } catch (e) { return null; }
    }

    const goToStep = (stepNum) => {
        state.step = stepNum;
        const hero = document.querySelector('.hero-section');
        if (hero) stepNum > 1 ? hero.classList.add('hidden') : hero.classList.remove('hidden');
        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`step${stepNum}`);
        if (target) target.classList.add('active');
        steps.forEach(s => {
            const n = parseInt(s.dataset.step);
            s.classList.remove('active', 'completed');
            if (n < stepNum) s.classList.add('completed');
            if (n === stepNum) s.classList.add('active');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.querySelectorAll('.prevStep').forEach(btn => btn.onclick = () => goToStep(state.step - 1));

    if (analyzeBtn) {
        analyzeBtn.onclick = async () => {
            state.projectInfo.idea = document.getElementById('projectIdea').value;
            state.projectInfo.country = document.getElementById('country').value;
            state.projectInfo.language = document.getElementById('language').value;
            state.projectInfo.currency = document.getElementById('currency').value;
            if (!state.projectInfo.idea) return alert('يرجى إدخال الفكرة');
            analyzeBtn.innerText = i18n[state.projectInfo.language].analyzing;
            analyzeBtn.disabled = true;
            const prompt = `أنت خبير إنساني، حلل الفكرة: "${state.projectInfo.idea}" في "${state.projectInfo.country}". الرد JSON: { "sector": "..", "target": "..", "challenges": "..", "summary": ".." }`;
            const res = await callGemini(prompt);
            const data = res ? extractJSON(res) : null;
            if (!data) { analyzeBtn.innerText = i18n[state.projectInfo.language].analyze; analyzeBtn.disabled = false; return; }
            state.analysis = data;
            const resArea = document.getElementById('analysisResult');
            resArea.innerHTML = `<div class="glass-card" style="padding:20px; border:1px solid var(--accent);"><h3>${data.sector}</h3><p>${data.summary}</p><button id="nextToIdeas" class="btn btn-primary" style="margin-top:15px; width:100%">${i18n[state.projectInfo.language].nextToIdeas}</button></div>`;
            resArea.style.display = 'block';
            analyzeBtn.disabled = false; analyzeBtn.innerText = i18n[state.projectInfo.language].analyze;
            document.getElementById('nextToIdeas').onclick = () => { generateIdeas(); goToStep(2); };
        };
    }

    async function generateIdeas() {
        ideasGrid.innerHTML = `<p style="text-align:center">${i18n[state.projectInfo.language].loadingIdeas}</p>`;
        const prompt = `ابتكر 3 أفكار مشاريع بناءً على: ${JSON.stringify(state.analysis)}. الرد JSON: [ { "name": "..", "description": "..", "goal": ".." } ]`;
        const res = await callGemini(prompt);
        const data = res ? extractJSON(res) : null;
        if (!data) return;
        state.ideas = data;
        ideasGrid.innerHTML = '';
        data.forEach(idea => {
            const div = document.createElement('div'); div.className = 'glass-card idea-card'; div.style.padding = '15px';
            div.innerHTML = `<h4>${idea.name}</h4><p>${idea.description}</p>`;
            div.onclick = () => {
                document.querySelectorAll('.idea-card').forEach(c => c.style.borderColor = 'var(--glass-border)');
                div.style.borderColor = 'var(--primary)'; state.selectedIdea = idea; generateProposalBtn.disabled = false;
            };
            ideasGrid.appendChild(div);
        });
    }

    if (regenerateIdeasBtn) regenerateIdeasBtn.onclick = () => generateIdeas();

    if (generateProposalBtn) {
        generateProposalBtn.onclick = async () => {
            generateProposalBtn.disabled = true; await generateFullProposal(); goToStep(3); generateProposalBtn.disabled = false;
        };
    }

    async function generateFullProposal() {
        proposalContent.innerHTML = `<p>${i18n[state.projectInfo.language].loadingProposal}</p>`;
        const prompt = `اكتب مقترحاً كاملاً لـ "${state.selectedIdea.name}". الرد JSON أقسام: { "العنوان": "النص..." }`;
        const res = await callGemini(prompt);
        const data = res ? extractJSON(res) : null;
        if (!data) return;
        state.proposal = data;
        proposalContent.innerHTML = '';
        for (let key in data) {
            const d = document.createElement('div'); d.innerHTML = `<h5 style="color:var(--primary)">${key}</h5><p style="text-align:justify">${data[key]}</p><hr style="opacity:0.1">`;
            proposalContent.appendChild(d);
        }
    }

    document.getElementById('goToBudgetBtn').onclick = async () => { await generateBudget(); goToStep(4); };

    async function generateBudget() {
        budgetBody.innerHTML = `<tr><td colspan="6">${i18n[state.projectInfo.language].loadingBudget}</td></tr>`;
        const prompt = `ميزانية لمشروع "${state.selectedIdea.name}" بالعملة ${state.projectInfo.currency}. الرد JSON: [ { "name": "الفئة", "items": [ { "item": "..", "desc": "..", "qty": 1, "unit": "..", "price": 100 } ] } ]`;
        const res = await callGemini(prompt);
        const data = res ? extractJSON(res) : null;
        if (!data) return;
        state.budget = data;
        budgetBody.innerHTML = ''; let total = 0;
        data.forEach(cat => {
            cat.items.forEach(item => {
                const rowTotal = item.qty * item.price; total += rowTotal;
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${item.item}</td><td>${item.desc}</td><td>${item.qty}</td><td>${item.unit}</td><td>${item.price}</td><td>${rowTotal.toLocaleString()}</td>`;
                budgetBody.appendChild(tr);
            });
        });
        grandTotalEl.innerText = `${total.toLocaleString()} ${state.projectInfo.currency}`;
    }

    document.getElementById('goToExportBtn').onclick = () => { renderFinal(); goToStep(5); };

    function renderFinal() {
        let h = `<h2>${state.selectedIdea.name}</h2>`;
        for (let k in state.proposal) h += `<h4>${k}</h4><p>${state.proposal[k]}</p>`;
        finalPreview.innerHTML = h;
    }

    updateLanguage('ar');
    updateGatewayStatus('connected');
});
