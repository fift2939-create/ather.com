document.addEventListener('DOMContentLoaded', () => {
    // API Key & Configuration
    const GEMINI_API_KEY = "AIzaSyCG6oe58UYnyF2Rjr3wnIiHFoynvpFprHk";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
            chartTitle: "توزيع الميزانية"
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
            chartTitle: "Budget Allocation"
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
    };

    languageSelect.addEventListener('change', (e) => {
        state.projectInfo.language = e.target.value;
        updateLanguage(state.projectInfo.language);
    });

    // AI Call Wrapper
    async function callGemini(prompt) {
        try {
            const response = await fetch(GEMINI_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
                })
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Gemini API Error:", error);
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

        const prompt = `أنت خبير في كتابة المشاريع الإنسانية. حلل فكرة المشروع التالية: "${state.projectInfo.idea}" في الدولة: "${state.projectInfo.country}" باللغة: "${state.projectInfo.language === 'ar' ? 'العربية' : 'الإنجليزية'}". 
        قم بالرد بتنسيق JSON حصراً كالتالي:
        { "sector": "القطاع", "target": "الفئة المستهدفة", "challenges": "التحديات", "summary": "ملخص تحليلي عميق" }`;

        const response = await callGemini(prompt);
        let analysis;
        if (response) {
            try {
                const cleaned = response.replace(/```json|```/g, '').trim();
                analysis = JSON.parse(cleaned);
            } catch (e) {
                analysis = simulateAnalysis(state.projectInfo);
            }
        } else {
            analysis = simulateAnalysis(state.projectInfo);
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

        const prompt = `بناءً على التحليل: ${JSON.stringify(state.analysis)}، اقترح من 3 إلى 5 أفكار مشاريع إنسانية مطورة واحترافية باللغة ${lang}. 
        يجب أن يكون الرد JSON حصراً: [ { "name": "اسم المشروع", "description": "وصف تفصيلي", "goal": "الهدف الاستراتيجي" } ]`;

        const response = await callGemini(prompt);
        let ideas;
        if (response) {
            try {
                const cleaned = response.replace(/```json|```/g, '').trim();
                ideas = JSON.parse(cleaned);
            } catch (e) {
                ideas = simulateIdeas(state.projectInfo);
            }
        } else {
            ideas = simulateIdeas(state.projectInfo);
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
        استخدم لغة قوية تبرز الأثر الإنساني العميق والضرورة القصوى للتدخل.
        يجب أن يحتوي المقترح على الأقسام التالية: (الملخص التنفيذي، الخلفية والاحتياج، بيان المشكلة، الأهداف الاستراتيجية، الفئات المستهدفة، الأنشطة الميدانية، المنهجية، النتائج المتوقعة، الاستدامة، المخاطر، الخاتمة المحفزة).
        الرد بصيغة JSON حصراً كالتالي: { "اسم القسم": "محتوى احترافي ومحفز" }`;

        const response = await callGemini(prompt);
        let proposal;
        if (response) {
            try {
                // Try to extract JSON if Gemini returned markdown-wrapped JSON
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                const cleaned = jsonMatch ? jsonMatch[0] : response;
                proposal = JSON.parse(cleaned);
            } catch (e) {
                console.warn("Falling back to simulated proposal due to parsing error");
                proposal = simulateProposal(state.selectedIdea, state.projectInfo.country, lang);
            }
        } else {
            proposal = simulateProposal(state.selectedIdea, state.projectInfo.country, lang);
        }

        if (!proposal || Object.keys(proposal).length === 0) {
            proposal = simulateProposal(state.selectedIdea, state.projectInfo.country, lang);
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
                <div contenteditable="true" data-key="${section}" style="white-space: pre-line; line-height: 1.9; color: var(--text-primary); text-align: justify; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.01);">${proposal[section]}</div>
            `;
            proposalContent.appendChild(div);
        }
    }

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

        const prompt = `صمم ميزانية تفصيلية لمشروع "${state.selectedIdea.name}" بالعملة "${state.projectInfo.currency}" واللغة "${lang}". 
        يجب تصنيفها إلى: (الموارد البشرية، الأنشطة الميدانية، التكاليف التشغيلية). 
        الرد JSON: [ { "name": "اسم الفئة", "items": [ { "item": "البند", "desc": "الوصف", "qty": 10, "unit": "الوحدة", "price": 100 } ] } ]`;

        const response = await callGemini(prompt);
        let categories;
        if (response) {
            try {
                const jsonMatch = response.match(/\[[\s\S]*\]/);
                const cleaned = jsonMatch ? jsonMatch[0] : response;
                categories = JSON.parse(cleaned);
            } catch (e) {
                categories = simulateBudgetCategories(lang);
            }
        } else {
            categories = simulateBudgetCategories(lang);
        }

        if (!categories || categories.length === 0) {
            categories = simulateBudgetCategories(lang);
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
            html += `<h3 style="color: #4f46e5; border-right: 5px solid #4f46e5; padding-right: 15px; margin: 30px 0 15px;">${sec.querySelector('h4').innerText}</h3>`;
            html += `<p style="line-height:1.8; text-align:justify;">${sec.querySelector('p').innerText}</p>`;
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
        grid.innerHTML = projects.length ? '' : '<p style="grid-column: 1/-1; text-align:center;">لا توجد مشاريع محفوظة حالياً</p>';

        projects.reverse().forEach(p => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '20px';
            card.innerHTML = `
                <h4 style="color: var(--primary); margin-bottom: 10px;">${p.idea.name}</h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 15px;">📅 ${new Date(p.date).toLocaleDateString()}</p>
                <div style="display:flex; justify-content:space-between;">
                    <button class="btn btn-ghost btn-sm" onclick="alert('جاري التحميل...')">📄 استعراض</button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--danger);" onclick="deleteProject(${p.id})">🗑️ حذف</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    window.deleteProject = (id) => {
        let projects = JSON.parse(localStorage.getItem('athar_projects') || '[]');
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('athar_projects', JSON.stringify(projects));
        renderSavedProjects();
    };

    // Export Logic
    document.getElementById('exportWordBtn').onclick = async () => {
        const btn = document.getElementById('exportWordBtn');
        btn.innerText = 'جاري التصدير...';
        try {
            const response = await fetch('http://localhost:3000/api/export/word', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposal: state.proposal,
                    selectedIdea: state.selectedIdea,
                    projectInfo: state.projectInfo
                })
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `${state.selectedIdea.name}.docx`; a.click();
        } finally { btn.innerText = 'تصدير Word (.docx)'; }
    };

    document.getElementById('exportExcelBtn').onclick = async () => {
        const btn = document.getElementById('exportExcelBtn');
        btn.innerText = 'جاري التصدير...';
        try {
            const response = await fetch('http://localhost:3000/api/export/excel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budget: state.budget, projectInfo: state.projectInfo })
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `Budget_${state.projectInfo.currency}.xlsx`; a.click();
        } finally { btn.innerText = 'تصدير Excel (.xlsx)'; }
    };

    // Simulation Fallbacks
    function simulateAnalysis(i) {
        return { sector: "التنمية المستدامة", target: "الأسر المتعففة", challenges: "ضعف الإمكانيات", summary: "مشروع حيوي يتطلب تدخل عاجل بناءً على المسح الميداني الأولي." };
    }

    function simulateIdeas(info) {
        const isAr = info.language === 'ar';
        return [
            {
                name: isAr ? "تحسين سبل العيش المستدام (سبُل)" : "Sustainable Livelihood Improvement (SOBOL)",
                description: isAr ? "برنامج متكامل لتمكين الأسر اقتصادياً عبر التدريب المهني وتزويدهم بأدوات الإنتاج (حقائب مهنية) لبدء مشاريع صغيرة مدرة للدخل." : "An integrated program for family economic empowerment through vocational training and production tools provision.",
                goal: isAr ? "تحويل 100 أسرة من الاعتماد على المساعدات إلى الانتاج المستقل." : "Transitioning 100 families from aid dependency to independent production."
            },
            {
                name: isAr ? "أكاديمية أثر للمهارات الرقمية" : "Athar Digital Skills Academy",
                description: isAr ? "منصة لتدريب الشباب على مهن المستقبل مثل البرمجة والتصميم الجرافيكي، والعمل الحر عبر الإنترنت لكسر قيود البطالة الجغرافية." : "A platform to train youth on future jobs like coding and graphic design to overcome geographical unemployment.",
                goal: isAr ? "تمكين 250 شاب وشابة من الحصول على فرص عمل دولية عبر الإنترنت." : "Empowering 250 youth to secure international remote work opportunities."
            },
            {
                name: isAr ? "مبادرة الأمن الغذائي المنزلي" : "Home Food Security Initiative",
                description: isAr ? "تحويل أسطح المنازل والمساحات الصغيرة إلى وحدات إنتاج غذائي مصغرة (زراعة مائية) لضمان توفر الاحتياجات الأساسية وعائد إضافي." : "Transforming rooftops into food production units (hydroponics) to ensure basic needs and extra income.",
                goal: isAr ? "تحقيق الاكتفاء الذاتي الغذائي لـ 50 أسرة محرومة في المنطقة." : "Achieving food self-sufficiency for 50 deprived families in the region."
            }
        ];
    }

    function simulateProposal(idea, country, lang) {
        const isAr = lang === 'ar';
        if (isAr) {
            return {
                "1. الملخص التنفيذي للمشروع": `نحن نقف اليوم أمام فرصة تاريخية لإحداث تحول حقيقي في حياة المتضررين في ${country}. إن مشروع "${idea.name}" ليس مجرد خطة عمل، بل هو صرخة أمل وجسر نحو مستقبل أفضل. نهدف من خلاله إلى ${idea.goal} عبر آليات تمكين مبتكرة تتجاوز مجرد الدعم المؤقت إلى التنمية المستدامة والشاملة.`,
                "2. الضرورة القصوى والاحتياج": `البيانات الميدانية في ${country} تتحدث عن واقع يتطلب تدخلاً عاجلاً لا يحتمل التأجيل. تعاني العائلات من فجوات معيشية حادة تهدد استقرارها الأساسي، مما يجعل من هذا المشروع ضرورة أخلاقية وتنموية لإنقاذ الكرامة الإنسانية.`,
                "3. تحدي المشروع وكسر الجمود": `لقد سئم الناس من الحلول السطحية. مشروعنا يأتي ليعالج "جذور المشكلة" المتمثلة في انعدام الفرص، محولاً اليأس إلى طاقة منتجة من خلال تمليك المستهدفين أدوات صناعة مستقبلهم بأيديهم.`,
                "4. الرؤية والأهداف الاستراتيجية": `نسعى لتحقيق أثر ملموس وقابل للقياس يتلخص في:\n• رؤية شاملة: خلق مجتمعات مرنة قادرة على الصمود.\n• أهداف محددة: تمكين 100 أسرة، بناء قدرات مهنية عالمية، وضمان استدامة الدخل بنسبة 100%.`,
                "5. خارطة الطريق والأنشطة": `استراتيجيتنا تعتمد على "التغيير المتسارع" من خلال:\n• ورش عمل تقنية مكثفة.\n• تسليم حزم التمكين المتكاملة.\n• مرافقة المستفيدين ببرامج توجيه احترافية لضمان النجاح.`,
                "6. فلسفة الاستدامة والأثر": `سر تميزنا يكمن في "الخروج الآمن"، حيث نترك وراءنا مستفيدين منتجين، وجمعيات محلية قوية، وبيئة اقتصادية حيوية لا تعتمد على المساعدات بعد اليوم.`,
                "7. دعوة للمشاركة في الأثر": `إن استثماركم في مشروع "${idea.name}" في ${country} هو استثمار في كرامة الإنسان. معاً، لا نقدم سمكة، بل نعيد صياغة مفهوم الصيد ليكون المحرك الجديد للمستقبل.`
            };
        }
        return {
            "1. Executive Motivation": `We stand today before a historic opportunity to create real transformation in ${country}. The "${idea.name}" project is not just a plan; it's a beacon of hope and a bridge to a better future.`,
            "2. Critical Need": `Field data in ${country} reveals a reality that demands immediate intervention. Families face severe living gaps that threaten basic stability.`,
            "3. Conclusion": `Your investment in "${idea.name}" is an investment in human dignity. Together, we can rebuild futures.`
        };
    }

    function simulateBudgetCategories(l) {
        const isAr = l === 'ar';
        const HR = isAr ? 'الموارد البشرية' : 'Human Resources';
        const ACT = isAr ? 'أنشطة المشروع' : 'Project Activities';
        const OPS = isAr ? 'التكاليف التشغيلية' : 'Operational Costs';

        return [
            {
                name: HR,
                items: [
                    { item: isAr ? 'مدير مشروع' : 'Project Manager', desc: isAr ? 'إشراف كامل وتنسيق' : 'Full supervision', qty: 1, unit: isAr ? 'شهر' : 'Month', price: 1500 },
                    { item: isAr ? 'منسق ميداني' : 'Field Coordinator', desc: isAr ? 'متابعة التنفيذ' : 'Field follow-up', qty: 2, unit: isAr ? 'شهر' : 'Month', price: 1000 }
                ]
            },
            {
                name: ACT,
                items: [
                    { item: isAr ? 'دورات تدريبية' : 'Training Workshops', desc: isAr ? 'تأهيل مهني' : 'Skills training', qty: 5, unit: isAr ? 'دورة' : 'Course', price: 800 },
                    { item: isAr ? 'حقائب التمكين' : 'Empowerment Kits', desc: isAr ? 'أدوات إنتاج' : 'Production tools', qty: 100, unit: isAr ? 'حقيبة' : 'Kit', price: 350 }
                ]
            },
            {
                name: OPS,
                items: [
                    { item: isAr ? 'إيجار مركز التدريب' : 'Rent', desc: isAr ? 'مساحة تنفيذ' : 'Execution space', qty: 1, unit: isAr ? 'مقطوع' : 'Lump', price: 1200 },
                    { item: isAr ? 'اتصالات وإنترنت' : 'Comms', desc: isAr ? 'تنسيق إداري' : 'Coordination', qty: 4, unit: isAr ? 'شهر' : 'Month', price: 100 }
                ]
            }
        ];
    }

    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });
});
