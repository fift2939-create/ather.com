document.addEventListener('DOMContentLoaded', () => {
    // API Key & Configuration
    const GEMINI_API_KEY = "AIzaSyCG6oe58UYnyF2Rjr3wnIiHFoynvpFprHk";

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

        document.querySelector('.logo-slogan').innerText = t.slogan;
        document.querySelector('.hero-section h1').innerText = t.hero;
        document.querySelector('label[for="projectIdea"]').innerText = t.labelIdea;
        document.querySelector('label[for="country"]').innerText = t.labelCountry;
        document.querySelector('label[for="language"]').innerText = t.labelLang;
        document.querySelector('label[for="currency"]').innerText = t.labelCurrency;
        document.getElementById('projectIdea').placeholder = t.placeholderIdea;
        document.getElementById('country').placeholder = t.placeholderCountry;
        analyzeBtn.innerText = t.analyze;

        const stepLabels = [t.ideasStep, t.ideasStep, t.proposalStep, t.budgetStep, t.exportStep]; // Placeholder labels
        steps.forEach((s, i) => {
            const stepNames = [i18n[lang].analysisTitle, i18n[lang].ideasStep, i18n[lang].proposalStep, i18n[lang].budgetStep, i18n[lang].exportStep];
            if (s.querySelector('span')) s.querySelector('span').innerText = stepNames[i];
        });

        document.querySelectorAll('.prevStep').forEach(b => b.innerText = t.prev);
        generateProposalBtn.innerText = t.contProposal;
        document.getElementById('goToBudgetBtn').innerText = t.prepBudget;
        document.getElementById('goToExportBtn').innerText = t.nextExport;
        document.getElementById('smartEditBtn').innerText = t.smartEdit;
        saveProjectBtn.innerText = t.saveLocally;
        regenerateIdeasBtn.innerText = t.otherIdeas;
    };

    languageSelect.addEventListener('change', (e) => {
        state.projectInfo.language = e.target.value;
        updateLanguage(state.projectInfo.language);
    });

    // AI Call Wrapper - Simplified for maximum reliability
    async function callGemini(prompt, config = {}) {
        const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: config.temperature || 0.7,
                        maxOutputTokens: config.maxTokens || 4096,
                    }
                })
            });

            if (!response.ok) {
                const errorJson = await response.json().catch(() => ({}));
                const msg = errorJson.error?.message || "";

                // Fallback to gemini-pro if flash is not found
                if (response.status === 404 || msg.toLowerCase().includes("not found")) {
                    console.warn("Flash not found, trying gemini-pro...");
                    const fallbackURL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
                    const fallbackResponse = await fetch(fallbackURL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                temperature: config.temperature || 0.7,
                                maxOutputTokens: config.maxTokens || 4096,
                            }
                        })
                    });

                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        return fallbackData.candidates[0].content.parts[0].text;
                    }
                }

                throw new Error(msg || `HTTP ${response.status}`);
            }

            const data = await response.json();
            if (!data.candidates || !data.candidates[0].content) {
                throw new Error("Empty AI Response");
            }

            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error("AI Connection Detail:", error);
            const isNetworkError = error.message === 'Failed to fetch';

            const msg = isNetworkError
                ? (state.projectInfo.language === 'ar' ? "فشل الاتصال بالخادم. يرجى التأكد من الإنترنت أو تجرب متصفح آخر." : "Network Error: Please check your internet or try another browser.")
                : error.message;

            alert(state.projectInfo.language === 'ar' ?
                `⚠️ عائق فني: ${msg}\n\nنصيحة: إذا كنت تشغل الملف محلياً، قد يحظره المتصفح. جرب فتحه في Chrome أو Edge.` :
                `⚠️ Technical Obstacle: ${msg}\n\nTip: Browsers may block local file requests. Try Chrome or Edge.`);

            return null;
        }
    }

    // Robust JSON Extractor Helper
    function extractJSON(text) {
        try {
            // Try to find content between ```json and ```
            const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch && codeBlockMatch[1]) {
                return JSON.parse(codeBlockMatch[1].trim());
            }
            // Try to find content between { } or [ ]
            const bracketMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (bracketMatch && bracketMatch[0]) {
                return JSON.parse(bracketMatch[0].trim());
            }
            // Direct parse as last resort
            return JSON.parse(text.trim());
        } catch (e) {
            console.error("JSON Extraction failed:", e, "Text:", text);
            return null;
        }
    }

    // Navigation Logic
    const goToStep = (stepNum) => {
        state.step = stepNum;

        // Hide hero section when moving past step 1
        const hero = document.querySelector('.hero-section');
        if (hero) {
            if (stepNum > 1) {
                hero.classList.add('hidden');
            } else {
                hero.classList.remove('hidden');
            }
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

        // Professional scroll: if header is hidden, scroll content into view
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
        let analysis;
        if (response) {
            analysis = extractJSON(response);
        }

        if (!analysis) {
            alert(state.projectInfo.language === 'ar' ? 'فشل الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.' : 'AI Connection failed. Please try again.');
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

        document.getElementById('nextToIdeas').onclick = () => {
            generateIdeas();
            goToStep(2);
        };
    });

    // Module 2: Ideas Generation
    async function generateIdeas() {
        const lang = state.projectInfo.language;
        const t = i18n[lang];
        ideasGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 60px;">
            <p style="margin-bottom: 20px;">${t.loadingIdeas}</p>
        </div>`;

        const prompt = `ابتكر من 3 إلى 5 أفكار مشاريع إنسانية حقيقية ومبتكرة تماماً بناءً على هذا التحليل السيادي: ${JSON.stringify(state.analysis)} في منطقة ${state.projectInfo.country} باللغة ${lang}.
        مهم جداً: لا تكرر الأفكار السابقة، ابحث عن حلول خارج الصندوق (مثلاً: حلول طاقة شمسية، زراعة ذكية، منصات تعليمية، تمكين تقني).
        يجب أن تكون المشاريع واقعية وتلبي احتياجات ملموسة.
        يجب أن يكون الرد JSON حصراً: [ { "name": "اسم المشروع المبتكر", "description": "وصف تقني وعملي مفصل", "goal": "الأثر المتوقع القابل للقياس" } ]`;

        const response = await callGemini(prompt, { temperature: 0.8 });
        let ideas;
        if (response) {
            ideas = extractJSON(response);
        }

        if (!ideas || !Array.isArray(ideas)) {
            ideasGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--danger);">
                <p>${lang === 'ar' ? 'فشل في توليد أفكار جديدة. يرجى الضغط على "غير ذلك" للمحاولة مجدداً.' : 'Failed to generate ideas. Please click "Others" to retry.'}</p>
                <button class="btn btn-primary" onclick="generateIdeas()">${lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
            </div>`;
            return;
        }

        state.ideas = ideas;
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
                generateProposalBtn.disabled = false;
            };
            ideasGrid.appendChild(card);
        });
    }

    regenerateIdeasBtn.onclick = () => {
        generateIdeas();
    };

    generateProposalBtn.onclick = async () => {
        generateProposalBtn.innerText = i18n[state.projectInfo.language].analyzing;
        generateProposalBtn.disabled = true;
        await generateFullProposal();
        generateProposalBtn.innerText = i18n[state.projectInfo.language].contProposal;
        generateProposalBtn.disabled = false;
        goToStep(3);
    };

    // Module 3: Full Proposal
    async function generateFullProposal() {
        const lang = state.projectInfo.language;
        const t = i18n[lang];
        proposalContent.innerHTML = `<p style="text-align:center; padding: 40px;">${t.loadingProposal}</p>`;

        const prompt = `أنت كاتب مقترحات مشاريع إنسانية محترف. صغ مقترحاً متكاملاً، مُقنعاً، ومحفزاً جداً للمانحين لمشروع "${state.selectedIdea.name}" في "${state.projectInfo.country}" باللغة ${lang}. 
        استخدم لغة قوية تبرز الأثر الإنساني العميق والضرورة القصوى للتدخل بناءً على الواقع الحالي في ${state.projectInfo.country}.
        يجب أن يحتوي المقترح على الأقسام التالية: (الملخص التنفيذي، الخلفية والاحتياج، بيان المشكلة، الأهداف الاستراتيجية، الفئات المستهدفة، الأنشطة الميدانية، المنهجية، النتائج المتوقعة، الاستدامة، المخاطر، الخاتمة المحفزة).
        الرد بصيغة JSON حصراً كالتالي: { "اسم القسم": "محتوى احترافي ومحفز ومفصل" }`;

        const response = await callGemini(prompt, { temperature: 0.8 });
        let proposal;
        if (response) {
            proposal = extractJSON(response);
        }

        if (!proposal || Object.keys(proposal).length === 0) {
            alert(lang === 'ar' ? 'حدث خطأ في صياغة المقترح. سيتم إعادة المحاولة...' : 'Error drafting proposal. Retrying...');
            return generateFullProposal();
        }

        state.proposal = proposal;
        proposalContent.innerHTML = '';
        for (const section in proposal) {
            const div = document.createElement('div');
            div.className = 'proposal-sec bounce-in';
            div.style.marginBottom = '35px';
            div.style.animation = 'fadeIn 0.6s ease-out';
            div.innerHTML = `
                    <h4 style="color: var(--primary); border-right: 5px solid var(--primary); padding-right: 18px; margin-bottom: 15px; font-weight: 800; font-size: 1.1rem;">${section}</h4>
                    <div contenteditable="true" data-key="${section}" class="proposal-edit-area" style="white-space: pre-line; line-height: 1.9; color: var(--text-primary); text-align: justify; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.01);">${proposal[section]}</div>
                `;
            proposalContent.appendChild(div);
        }

        // Sync edits back to state
        proposalContent.querySelectorAll('.proposal-edit-area').forEach(div => {
            div.oninput = () => {
                const key = div.getAttribute('data-key');
                state.proposal[key] = div.innerText;
            };
        });
    }

    // Smart Edit Functionalilty
    smartEditBtn.onclick = () => {
        chatSidebar.style.display = chatSidebar.style.display === 'none' ? 'block' : 'none';
    };

    sendChatBtn.onclick = async () => {
        const instruction = chatInput.value.trim();
        if (!instruction) return;

        sendChatBtn.innerText = i18n[state.projectInfo.language].analyzing;
        sendChatBtn.disabled = true;

        const currentProposal = JSON.stringify(state.proposal);
        const prompt = `أنت خبير في تطوير المشاريع الإنسانية. 
        بناءً على هذا المقترح الحالي: ${currentProposal}
        نفذ الطلب التالي لتعديله وتطويره: "${instruction}"
        يجب أن تحافظ على نفس هيكل الـ JSON المكون من (أقسام: محتوى) وتحدث الأقسام المطلوبة فقط أو أضف أقساماً جديدة إذا لزم الأمر.
        الرد JSON حصراً.`;

        const response = await callGemini(prompt);
        if (response) {
            const updatedProposal = extractJSON(response);
            if (updatedProposal) {
                state.proposal = updatedProposal;
                // Re-render proposalContent
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
                chatInput.value = '';
                chatSidebar.style.display = 'none';
            }
        }

        sendChatBtn.innerText = 'تطبيق التعديلات';
        sendChatBtn.disabled = false;
    };

    // Module 4: Budget
    document.getElementById('goToBudgetBtn').onclick = async () => {
        document.getElementById('goToBudgetBtn').innerText = i18n[state.projectInfo.language].analyzing;
        document.getElementById('goToBudgetBtn').disabled = true;
        await generateBudget();
        document.getElementById('goToBudgetBtn').innerText = i18n[state.projectInfo.language].prepBudget;
        document.getElementById('goToBudgetBtn').disabled = false;
        goToStep(4);
    };

    async function generateBudget() {
        const lang = state.projectInfo.language;
        const t = i18n[lang];
        budgetBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px;">${t.loadingBudget}</td></tr>`;

        const prompt = `صمم ميزانية تفصيلية وواقعية لمشروع "${state.selectedIdea.name}" في "${state.projectInfo.country}" بالعملة "${state.projectInfo.currency}" واللغة "${lang}". 
        يجب أن تعكس الأسعار والتكاليف الواقعية في المنطقة.
        يجب تصنيفها إلى: (الموارد البشرية، الأنشطة الميدانية، التكاليف التشغيلية). 
        الرد JSON حصراً: [ { "name": "اسم الفئة", "items": [ { "item": "البند", "desc": "الوصف", "qty": 10, "unit": "الوحدة", "price": 100 } ] } ]`;

        const response = await callGemini(prompt, { temperature: 0.5 });
        let categories;
        if (response) {
            categories = extractJSON(response);
        }

        if (!categories || categories.length === 0) {
            alert(lang === 'ar' ? 'فشل توليد الميزانية. يرجى المحاولة مرة أخرى.' : 'Budget generation failed.');
            document.getElementById('goToBudgetBtn').innerText = t.prepBudget;
            document.getElementById('goToBudgetBtn').disabled = false;
            return;
        }

        state.budget = categories;
        renderBudget();
    }

    function renderBudget() {
        const currency = state.projectInfo.currency;
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
        grandTotalEl.innerText = `${total.toLocaleString()} ${currency}`;
    }

    // Analytics & Final Preview
    document.getElementById('goToExportBtn').onclick = async () => {
        const btn = document.getElementById('goToExportBtn');
        const originalText = btn.innerText;
        btn.innerText = i18n[state.projectInfo.language].analyzing;
        btn.disabled = true;

        try {
            renderFinalPreview();
            renderAnalytics();
            goToStep(5);
        } catch (err) {
            console.error("Navigation Error:", err);
            goToStep(5); // Attempt to go anyway
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };

    function renderFinalPreview() {
        const lang = state.projectInfo.language;
        let html = `
            <div style="text-align:center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px;">
                <h1 style="font-size: 2.2rem; color: #1e293b;">${state.selectedIdea.name}</h1>
                <p style="color: #64748b;">${state.projectInfo.country} | ${new Date().toLocaleDateString(lang)}</p>
            </div>
        `;
        document.querySelectorAll('.proposal-sec').forEach(sec => {
            const title = sec.querySelector('h4').innerText;
            const content = sec.querySelector('.proposal-edit-area').innerText;
            html += `<h3 style="color: #4f46e5; border-right: 5px solid #4f46e5; padding-right: 15px; margin: 30px 0 15px;">${title}</h3>`;
            html += `<p style="line-height:1.8; text-align:justify; color: #334155;">${content}</p>`;
        });
        finalPreview.innerHTML = html;
    }

    function renderAnalytics() {
        const lang = state.projectInfo.language;
        const ctx = document.getElementById('budgetChart').getContext('2d');
        const percentagesEl = document.getElementById('budgetPercentages');

        let grandTotal = 0;
        const labels = [];
        const dataValues = [];
        const catTotals = [];

        state.budget.forEach(cat => {
            let catTotal = cat.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
            grandTotal += catTotal;
            catTotals.push(catTotal);
            labels.push(cat.name);
        });

        if (state.chart) state.chart.destroy();
        state.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: catTotals,
                    backgroundColor: ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }
        });

        percentagesEl.innerHTML = labels.map((label, i) => {
            const pc = ((catTotals[i] / grandTotal) * 100).toFixed(1);
            return `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${label}</span>
                    <span style="font-weight:bold; color: var(--primary);">${pc}%</span>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; margin-bottom:15px;">
                    <div style="width:${pc}%; height:100%; background:var(--primary); border-radius:3px;"></div>
                </div>
            `;
        }).join('');
    }

    // Local Storage Projects
    saveProjectBtn.onclick = () => {
        const projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
        projects.push({
            id: Date.now(),
            date: new Date().toISOString(),
            info: state.projectInfo,
            idea: state.selectedIdea,
            proposal: state.proposal,
            budget: state.budget
        });
        localStorage.setItem('athar_projects', JSON.stringify(projects));
        alert(i18n[state.projectInfo.language].savedSuccess);
    };

    viewSavedProjectsBtn.onclick = () => {
        renderSavedProjects();
        goToStep(6);
    };

    function renderSavedProjects() {
        const grid = document.getElementById('savedProjectsGrid');
        const projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');

        // Use the new grid class
        grid.className = 'saved-projects-grid';
        grid.innerHTML = projects.length ? '' : '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-secondary);">لا توجد مشاريع محفوظة حالياً. ابدأ بإنشاء مشروعك الأول!</p>';

        projects.reverse().forEach(p => {
            const card = document.createElement('div');
            card.className = 'saved-card';
            card.style.padding = '24px';
            card.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--primary); margin-bottom: 8px; font-size: 1.1rem; line-height: 1.4;">${p.idea.name}</h4>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary);">
                        <span>📅 ${new Date(p.date).toLocaleDateString(p.info.language)}</span>
                        <span>•</span>
                        <span>📍 ${p.info.country}</span>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; gap: 12px; border-top: 1px solid var(--glass-border); padding-top: 15px;">
                    <button class="btn btn-primary btn-sm" style="flex: 1; justify-content: center;" onclick="loadProject(${p.id})">استعراض المشروع</button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--danger); border-color: var(--danger); width: 45px; justify-content: center;" title="حذف" onclick="deleteProject(${p.id})">🗑️</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    window.loadProject = (id) => {
        const projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
        const project = projects.find(p => p.id === id);
        if (!project) return;

        state.projectInfo = project.info;
        state.selectedIdea = project.idea;
        state.proposal = project.proposal;
        state.budget = project.budget;

        // Re-render components with the loaded data
        renderFinalPreview();
        renderAnalytics();
        renderBudget();

        // Navigate to the final preview step
        goToStep(5);
    };

    window.deleteProject = (id) => {
        let projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('athar_projects', JSON.stringify(projects));
        renderSavedProjects();
    };

    // Export Logic (Client-Side for GitHub Compatibility)
    document.getElementById('exportWordBtn').onclick = () => {
        const btn = document.getElementById('exportWordBtn');
        const originalText = btn.innerText;
        btn.innerText = 'جاري المعالجة...';

        try {
            const content = `
                <!DOCTYPE html>
                <html lang="${state.projectInfo.language}" dir="${state.projectInfo.language === 'ar' ? 'rtl' : 'ltr'}">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 50px; }
                        h1 { color: #1e293b; text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
                        h3 { color: #4f46e5; border-right: 5px solid #4f46e5; padding-right: 15px; margin-top: 30px; }
                        p { text-align: justify; line-height: 1.6; color: #334155; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    ${finalPreview.innerHTML}
                    <div class="footer">
                        تم إنشاء هذا المقترح عبر منصة أثر للمشاريع الإنسانية - 2025
                    </div>
                </body>
                </html>
            `;

            const converted = htmlDocx.asBlob(content);
            const url = URL.createObjectURL(converted);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${state.selectedIdea.name}.docx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Word Export Error:", error);
            alert("حدث خطأ أثناء تصدير ملف Word. يرجى المحاولة مرة أخرى.");
        } finally {
            btn.innerText = originalText;
        }
    };

    document.getElementById('exportExcelBtn').onclick = () => {
        const btn = document.getElementById('exportExcelBtn');
        const originalText = btn.innerText;
        btn.innerText = 'جاري التجهيز...';

        try {
            const workbook = XLSX.utils.book_new();
            const data = [
                ["تقرير ميزانية المشروع"],
                ["اسم المشروع:", state.selectedIdea.name],
                ["الدولة:", state.projectInfo.country],
                ["العملة:", state.projectInfo.currency],
                [],
                ["الفئة", "البند", "الوصف", "الكمية", "الوحدة", "سعر الوحدة", "الإجمالي"]
            ];

            let grandTotal = 0;
            state.budget.forEach(cat => {
                cat.items.forEach(item => {
                    const lineTotal = item.qty * item.price;
                    grandTotal += lineTotal;
                    data.push([cat.name, item.item, item.desc, item.qty, item.unit, item.price, lineTotal]);
                });
            });

            data.push([]);
            data.push(["", "", "", "", "", "الإجمالي الكلي", grandTotal]);

            const worksheet = XLSX.utils.aoa_to_sheet(data);

            // Basic Styling for Worksheet
            worksheet['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];

            XLSX.utils.book_append_sheet(workbook, worksheet, "Budget");
            XLSX.writeFile(workbook, `Budget_${state.selectedIdea.name}.xlsx`);
        } catch (error) {
            console.error("Excel Export Error:", error);
            alert("حدث خطأ أثناء تصدير ملف Excel.");
        } finally {
            btn.innerText = originalText;
        }
    };

    // Simulation Fallbacks Removed - Enforcing Real AI usage

    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });
});
