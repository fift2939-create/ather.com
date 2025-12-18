document.addEventListener('DOMContentLoaded', () => {
    // API Key & Configuration
    const GEMINI_API_KEY = "AIzaSyCj0oDJV0MljYh1Y-NDTyur0Utvz7UPxeo";

    // --- GLOBAL BRIDGE (The Ultimate Fix for GitHub Pages) ---
    // ضع رابط الـ Deployment الجديد هنا
    const ATHAR_BRIDGE_URL = "https://script.google.com/macros/s/AKfycbyKczMPQUbG4x79fS3wbfC48nyHlJL80j8a1DOpX5FM_to4DfGbkQSGahJUSEmd7RCv/exec";

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
            grandTotal: "الإجمالي التقديري الكلي"
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
            grandTotal: "Total Estimated Budget"
        }
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
        async call(prompt, config = {}) {
            updateGatewayStatus('mapping');

            // محاولة الاتصال عبر الجسر أولاً (لأنه يحل مشكلة الحظر الجغرافي و Failed to fetch)
            if (ATHAR_BRIDGE_URL) {
                const bridgeRes = await this.execute('bridge', prompt, config);
                if (bridgeRes) {
                    updateGatewayStatus('connected', '(Cloud Bridge)');
                    return bridgeRes;
                }
            }

            // محاولة الاتصال المباشر كخطة بديلة (تعمل فقط مع الـ VPN)
            const directPaths = [
                { ver: 'v1', mod: 'gemini-1.5-flash' },
                { ver: 'v1beta', mod: 'gemini-1.5-flash' },
                { ver: 'v1', mod: 'gemini-pro' }
            ];

            for (const path of directPaths) {
                const res = await this.execute(path, prompt, config);
                if (res) {
                    updateGatewayStatus('connected', `(${path.mod})`);
                    return res;
                }
            }

            updateGatewayStatus('error');
            return null;
        },

        async execute(endpoint, prompt, config) {
            let URL = "";
            if (endpoint === 'bridge') {
                URL = `${ATHAR_BRIDGE_URL}?key=${GEMINI_API_KEY}`;
            } else {
                URL = `https://generativelanguage.googleapis.com/${endpoint.ver}/models/${endpoint.mod}:generateContent?key=${GEMINI_API_KEY}`;
            }

            try {
                const response = await fetch(URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || data.reply || null;
                }
                return null;
            } catch (e) {
                return null;
            }
        }
    };

    // --- بقية وظائف الموقع (مبسطة للسرعة) ---
    async function callAI(prompt) { return await AIGateway.call(prompt); }

    function extractJSON(text) {
        try {
            const bracket = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            return bracket ? JSON.parse(bracket[0]) : JSON.parse(text);
        } catch (e) { return null; }
    }

    const goToStep = (n) => {
        state.step = n;
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`step${n}`).classList.add('active');
        document.querySelectorAll('.step').forEach(s => {
            const sn = parseInt(s.dataset.step);
            s.classList.toggle('active', sn === n);
            s.classList.toggle('completed', sn < n);
        });
        if (n > 1) document.querySelector('.hero-section').classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.querySelectorAll('.prevStep').forEach(b => b.onclick = () => goToStep(state.step - 1));

    document.getElementById('analyzeBtn').onclick = async () => {
        const idea = document.getElementById('projectIdea').value;
        const country = document.getElementById('country').value;
        if (!idea) return alert('يرجى إدخال الفكرة');

        document.getElementById('analyzeBtn').innerText = 'جاري التحليل...';
        const prompt = `حلل هذه الفكرة الإنسانية: "${idea}" في "${country}". الرد JSON: { "sector": "..", "summary": "..", "target": "..", "challenges": ".." }`;
        const res = await callAI(prompt);
        const data = extractJSON(res);

        if (data) {
            state.analysis = data;
            const resArea = document.getElementById('analysisResult');
            resArea.innerHTML = `<div class="glass-card" style="padding:20px; border:1px solid var(--accent);"><h3>${data.sector}</h3><p>${data.summary}</p><button id="nextToIdeas" class="btn btn-primary" style="margin-top:15px; width:100%">عرض الأفكار والمقترحات ✨</button></div>`;
            resArea.style.display = 'block';
            document.getElementById('nextToIdeas').onclick = () => { generateIdeas(); goToStep(2); };
        }
        document.getElementById('analyzeBtn').innerText = 'تحليل الفكرة ⚡';
    };

    async function generateIdeas() {
        document.getElementById('ideasGrid').innerHTML = '<p style="text-align:center">جاري ابتكار خطط بديلة...</p>';
        const prompt = `بناءً على هذا التحليل: ${JSON.stringify(state.analysis)}، اقترح 3 مشاريع إنسانية مبتكرة. الرد JSON: [ { "name": "..", "description": "..", "goal": ".." } ]`;
        const res = await callAI(prompt);
        const data = extractJSON(res);
        if (data) {
            state.ideas = data;
            document.getElementById('ideasGrid').innerHTML = '';
            data.forEach(idea => {
                const div = document.createElement('div'); div.className = 'glass-card idea-card'; div.style.padding = '15px';
                div.innerHTML = `<h4>${idea.name}</h4><p>${idea.description}</p>`;
                div.onclick = () => {
                    document.querySelectorAll('.idea-card').forEach(c => c.style.borderColor = 'var(--glass-border)');
                    div.style.borderColor = 'var(--primary)'; state.selectedIdea = idea; document.getElementById('generateProposalBtn').disabled = false;
                };
                document.getElementById('ideasGrid').appendChild(div);
            });
        }
    }

    document.getElementById('generateProposalBtn').onclick = async () => {
        document.getElementById('proposalContent').innerHTML = '<p style="text-align:center">جاري صياغة المقترح الكامل...</p>';
        goToStep(3);
        const prompt = `اكتب مقترحاً كاملاً لـ "${state.selectedIdea.name}". الرد JSON أقسام: { "العنوان": "النص..." }`;
        const res = await callAI(prompt);
        const data = extractJSON(res);
        if (data) {
            state.proposal = data;
            document.getElementById('proposalContent').innerHTML = '';
            for (let k in data) {
                const d = document.createElement('div'); d.innerHTML = `<h5 style="color:var(--primary)">${k}</h5><p style="text-align:justify">${data[k]}</p><hr style="opacity:0.1">`;
                document.getElementById('proposalContent').appendChild(d);
            }
        }
    };

    document.getElementById('goToBudgetBtn').onclick = async () => {
        document.getElementById('budgetBody').innerHTML = '<tr><td colspan="6" style="text-align:center">جاري حساب الميزانية...</td></tr>';
        goToStep(4);
        const prompt = `صمم ميزانية لمشروع "${state.selectedIdea.name}". الرد JSON: [ { "name": "الفئة", "items": [ { "item": "..", "desc": "..", "qty": 1, "unit": "..", "price": 100 } ] } ]`;
        const res = await callAI(prompt);
        const data = extractJSON(res);
        if (data) {
            state.budget = data;
            document.getElementById('budgetBody').innerHTML = ''; let total = 0;
            data.forEach(cat => {
                cat.items.forEach(item => {
                    total += (item.qty * item.price);
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${item.item}</td><td>${item.desc}</td><td>${item.qty}</td><td>${item.unit}</td><td>${item.price}</td><td>${(item.qty * item.price).toLocaleString()}</td>`;
                    document.getElementById('budgetBody').appendChild(tr);
                });
            });
            document.getElementById('grandTotal').innerText = total.toLocaleString() + " USD";
        }
    };

    document.getElementById('goToExportBtn').onclick = () => {
        let h = `<h2>${state.selectedIdea.name}</h2>`;
        for (let k in state.proposal) h += `<h4>${k}</h4><p>${state.proposal[k]}</p>`;
        document.getElementById('finalPreview').innerHTML = h;
        goToStep(5);
    };

    updateGatewayStatus('connected');
});
